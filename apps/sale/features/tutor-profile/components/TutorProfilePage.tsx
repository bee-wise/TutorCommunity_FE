"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { TutorBioSection } from "./TutorBioSection";
import { TutorCertificates } from "./TutorCertificates";
import { TutorConnectCard } from "./TutorConnectCard";
import { TutorEducationAchievements } from "./TutorEducationAchievements";
import { TutorFeedback } from "./TutorFeedback";
import { TutorHero } from "./TutorHero";
import { TutorIntroVideo } from "./TutorIntroVideo";
import { TutorMobileCTA } from "./TutorMobileCTA";
import { TutorTeachingHistory } from "./TutorTeachingHistory";
import { TutorTeachingMethods } from "./TutorTeachingMethods";
import { useTutorDetailQuery } from "../hooks/useTutorDetailQuery";
import { useState, useEffect } from "react";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";
import Link from "next/link";
import LoadingGradient from "@workspace/ui/components/LoadingGradient";

export function TutorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data, isLoading, isError } = useTutorDetailQuery(id);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved: string[] = JSON.parse(
        localStorage.getItem("savedTutors") || "[]",
      );
      setIsSaved(saved.includes(id));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [id]);

  const handleConnect = () => {
    // TODO: kết nối với luồng gửi yêu cầu kết nối.
  };

  const handleBack = () => {
    const cameFromBeeWise =
      document.referrer.length > 0 &&
      new URL(document.referrer).origin === window.location.origin;

    if (cameFromBeeWise) {
      router.back();
      return;
    }

    router.push("/tutors");
  };

  const handleSave = () => {
    const saved: string[] = JSON.parse(
      localStorage.getItem("savedTutors") || "[]",
    );
    if (isSaved) {
      const newSaved = saved.filter((tutorId) => tutorId !== id);
      localStorage.setItem("savedTutors", JSON.stringify(newSaved));
      setIsSaved(false);
    } else {
      saved.push(id);
      localStorage.setItem("savedTutors", JSON.stringify(saved));
      setIsSaved(true);
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex min-h-[calc(100dvh-64px)] items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,197,0,0.10),transparent_38%),#fff] px-4 py-12"
        role="status"
        aria-live="polite"
      >
        <div className="flex -translate-y-4 flex-col items-center text-center sm:-translate-y-6">
          <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#280f91]/10 bg-[#280f91]/5">
            <span className="absolute inset-2 animate-ping rounded-xl bg-[#280f91]/10" aria-hidden="true" />
            <span className="relative h-5 w-5 animate-spin rounded-full border-2 border-[#280f91]/20 border-t-[#280f91]" aria-hidden="true" />
          </div>
          <LoadingGradient
            animationSpeed={2}
            showBorder={false}
            className="!h-auto !w-auto text-xl font-extrabold sm:text-2xl"
          >
            Đang tải thông tin gia sư
          </LoadingGradient>
          <p className="mt-2 text-sm text-[#667085]">
            BeeWise đang chuẩn bị hồ sơ và lịch dạy cho bạn.
          </p>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <EmptyState
          title="Không tìm thấy hồ sơ gia sư"
          description="Hồ sơ gia sư này không tồn tại hoặc đã bị gỡ. Vui lòng kiểm tra lại đường dẫn."
          action={
            <Link
              href="/tutors"
              className="text-primary hover:underline font-semibold text-sm"
            >
              Trở về danh sách gia sư
            </Link>
          }
        />
      </div>
    );
  }

  const tutorProfile = data.data;

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,rgba(250,220,120,0.55),transparent_34%),linear-gradient(180deg,#fff3cb_0%,#fffaf0_38%,#ffffff_100%)] py-6 sm:py-8 lg:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="group inline-flex h-10 w-fit items-center gap-2 rounded-full border border-[#d9dfea] bg-white/85 px-4 text-sm font-bold text-[#475467] shadow-sm backdrop-blur transition hover:-translate-x-0.5 hover:border-[#280f91]/25 hover:bg-white hover:text-[#280f91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91]/30"
          aria-label="Quay lại trang trước"
        >
          <ArrowLeftIcon
            size={17}
            weight="bold"
            className="transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Quay lại
        </button>

        <TutorHero tutor={tutorProfile} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)] lg:items-start">
          <div className="space-y-6">
            <TutorBioSection tutor={tutorProfile} />
            <TutorTeachingMethods tutor={tutorProfile} />
            <TutorEducationAchievements tutor={tutorProfile} />
            <TutorIntroVideo />
            <TutorTeachingHistory tutor={tutorProfile} />
            <TutorCertificates />
            <TutorFeedback tutor={tutorProfile} />
          </div>

          <TutorConnectCard
            tutor={tutorProfile}
            isSaved={isSaved}
            onConnect={handleConnect}
            onSave={handleSave}
          />
        </div>
      </div>

      <TutorMobileCTA
        onConnect={handleConnect}
        rate={tutorProfile.hourlyRate}
      />
      <div className="pb-24 lg:pb-0" />
    </div>
  );
}
