"use client";

import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { TutorAchievements } from "./TutorAchievements";
import { TutorBioSection } from "./TutorBioSection";
import { TutorConnectCard } from "./TutorConnectCard";
import { TutorOfferings } from "./TutorOfferings";
import { TutorAnchoredSection, TutorSectionNav } from "./TutorSectionNav";
import { TutorConnectDialog } from "./TutorConnectDialog";
import { TutorFeedback } from "./TutorFeedback";
import { TutorHero } from "./TutorHero";
import { TutorIntroVideo } from "./TutorIntroVideo";
import { TutorMobileCTA } from "./TutorMobileCTA";
import { TutorTeachingHistory } from "./TutorTeachingHistory";
import { TutorTeachingMethods } from "./TutorTeachingMethods";
import { useTutorDetailQuery } from "../hooks/useTutorDetailQuery";
import { useTutorConnectFlow } from "../hooks/useTutorConnectFlow";
import { useTutorViewTracker } from "../hooks/useTutorViewTracker";
import { resolveTutorUserIdFromCache } from "../utils/resolveTutorUserId";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";
import LoadingGradient from "@workspace/ui/components/LoadingGradient";
import { useFavoriteTutors } from "../../favorite-tutors/hooks/useFavoriteTutors";

const PAGE_BACKGROUND =
  "bg-[radial-gradient(circle_at_top_left,rgba(250,220,120,0.55),transparent_34%),linear-gradient(180deg,#fff3cb_0%,#fffaf0_38%,#ffffff_100%)]";

export function TutorProfilePage({
  tutorUserIdFromLink,
}: {
  tutorUserIdFromLink?: string;
}) {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const { data, isLoading, isError } = useTutorDetailQuery(id);
  const tutorProfileId = data?.data?.id;
  useTutorViewTracker(tutorProfileId);

  const { isFavorite, toggleFavorite } = useFavoriteTutors();
  const isSaved = isFavorite(id);
  const tutorUserId = [
    resolveTutorUserIdFromCache(queryClient, id),
    tutorUserIdFromLink,
    data?.data?.userId,
  ].find(
    (candidate): candidate is string => z.guid().safeParse(candidate).success,
  );
  const connectFlow = useTutorConnectFlow(tutorUserId ?? undefined);

  const handleConnect = () => {
    connectFlow.setDialogOpen(true);
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
    if (!id) return;
    toggleFavorite({
      tutorId: id,
      tutorName: data?.data?.displayName,
      isCurrentlySaved: isSaved,
    });
  };

  if (isLoading) {
    return (
      <div
        className="flex min-h-[calc(100dvh-64px)] items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,197,0,0.10),transparent_38%),#fff] px-4 py-12"
        role="status"
        aria-live="polite"
      >
        <div className="flex -translate-y-4 flex-col items-center text-center sm:-translate-y-6">
          <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5">
            <span
              className="absolute inset-2 animate-ping rounded-xl bg-primary/10"
              aria-hidden="true"
            />
            <span
              className="relative h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
              aria-hidden="true"
            />
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
            <button
              type="button"
              onClick={handleBack}
              className="text-primary hover:underline font-semibold text-sm cursor-pointer"
            >
              Trở về trang trước đó
            </button>
          }
        />
      </div>
    );
  }

  const tutorProfile = data.data;
  const hasOfferings =
    (tutorProfile.teachingOfferings?.length ?? 0) > 0 ||
    (tutorProfile.specializations?.length ?? 0) > 0;
  const hasVideo = Boolean(tutorProfile.videoUrl);
  const hasMethods = (tutorProfile.teachingMethods?.length ?? 0) > 0;
  const hasHistory = (tutorProfile.teachingHistory?.length ?? 0) > 0;
  const hasAchievements = (tutorProfile.achievements?.length ?? 0) > 0;

  const sectionNavItems = [
    { id: "gioi-thieu", label: "Giới thiệu" },
    ...(hasOfferings ? [{ id: "mon-day", label: "Môn dạy và học phí" }] : []),
    ...(hasVideo ? [{ id: "video", label: "Video" }] : []),
    ...(hasMethods ? [{ id: "phuong-phap", label: "Phương pháp" }] : []),
    ...(hasHistory ? [{ id: "kinh-nghiem", label: "Kinh nghiệm" }] : []),
    ...(hasAchievements ? [{ id: "thanh-tich", label: "Học vấn & thành tích" }] : []),
    { id: "danh-gia", label: "Đánh giá" },
  ];

  return (
    <div className={`${PAGE_BACKGROUND} py-6 sm:py-8 lg:py-10`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="group inline-flex h-10 w-fit items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-bold text-muted-foreground shadow-soft transition hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Quay lại trang trước"
        >
          <ArrowLeftIcon
            className="size-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Quay lại
        </button>

        <TutorHero tutor={tutorProfile} />

        {/* Connect card — shown inline on mobile right after hero, sticky sidebar on desktop */}
        <div className="lg:hidden">
          <TutorConnectCard
            tutor={tutorProfile}
            isSaved={isSaved}
            onConnect={handleConnect}
            onSave={handleSave}
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)] lg:items-start">
          <div className="min-w-0 space-y-5">
            <TutorSectionNav items={sectionNavItems} />

            <TutorAnchoredSection id="gioi-thieu">
              <TutorBioSection tutor={tutorProfile} />
            </TutorAnchoredSection>
            <TutorOfferings tutor={tutorProfile} />
            {hasVideo ? (
              <TutorAnchoredSection id="video">
                <TutorIntroVideo videoUrl={tutorProfile.videoUrl} />
              </TutorAnchoredSection>
            ) : null}
            {hasMethods ? (
              <TutorAnchoredSection id="phuong-phap">
                <TutorTeachingMethods tutor={tutorProfile} />
              </TutorAnchoredSection>
            ) : null}
            {hasHistory ? (
              <TutorAnchoredSection id="kinh-nghiem">
                <TutorTeachingHistory tutor={tutorProfile} />
              </TutorAnchoredSection>
            ) : null}
            {hasAchievements ? (
              <TutorAnchoredSection id="thanh-tich">
                <TutorAchievements tutor={tutorProfile} />
              </TutorAnchoredSection>
            ) : null}
            <TutorAnchoredSection id="danh-gia">
              <TutorFeedback tutor={tutorProfile} />
            </TutorAnchoredSection>
          </div>

          <div className="hidden lg:block lg:sticky lg:top-6">
            <TutorConnectCard
              tutor={tutorProfile}
              isSaved={isSaved}
              onConnect={handleConnect}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>

      <TutorMobileCTA
        onConnect={handleConnect}
        rate={tutorProfile.hourlyRate}
      />
      <TutorConnectDialog
        profileId={id}
        tutorName={tutorProfile.displayName}
        tutorUserId={tutorUserId ?? undefined}
        flow={connectFlow}
      />
      <div className="pb-24 lg:pb-0" />
    </div>
  );
}
