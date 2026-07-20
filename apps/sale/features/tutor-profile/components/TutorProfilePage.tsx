"use client";

import { useParams } from "next/navigation";
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
  const id = params.id as string;
  const { data, isLoading, isError } = useTutorDetailQuery(id);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedTutors") || "[]");
    if (saved.includes(id)) {
      setIsSaved(true);
    }
  }, [id]);

  const handleConnect = () => {
    // TODO: kết nối với luồng gửi yêu cầu kết nối.
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
      <LoadingGradient
        animationSpeed={2}
        showBorder={false}
        className="custom-class text-2xl"
      >
        Đang tải thông tin gia sư
      </LoadingGradient>
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
