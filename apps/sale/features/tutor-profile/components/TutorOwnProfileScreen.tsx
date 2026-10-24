import Link from "next/link";
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  EyeIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { Button } from "@workspace/ui/components/ui/button";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import type { TutorProfileData } from "../types/tutor.type";
import { mockTutorProfile } from "../types/mockTutorProfile";
import { useTutorDetailQuery } from "../hooks/useTutorDetailQuery";
import { getTutorStartingRate } from "../utils/starting-rate";
import { TutorAchievements } from "./TutorAchievements";
import { TutorAvailabilityList } from "./TutorAvailability";
import { TutorBioSection } from "./TutorBioSection";
import { TutorFeedback } from "./TutorFeedback";
import { TutorHero } from "./TutorHero";
import { TutorIntroVideo } from "./TutorIntroVideo";
import { TutorOfferings } from "./TutorOfferings";
import { TutorAnchoredSection, TutorSectionNav } from "./TutorSectionNav";
import { TutorTeachingHistory } from "./TutorTeachingHistory";
import { TutorTeachingMethods } from "./TutorTeachingMethods";

function getCompletionItems(tutor: TutorProfileData) {
  return [
    { label: "Giới thiệu chi tiết", done: Boolean(tutor.introduction?.trim()) },
    { label: "Video giới thiệu", done: Boolean(tutor.videoUrl) },
    {
      label: "Môn dạy và học phí",
      done:
        (tutor.teachingOfferings?.length ?? 0) > 0 ||
        (tutor.specializations?.length ?? 0) > 0,
    },
    { label: "Lịch nhận lớp", done: (tutor.availability?.length ?? 0) > 0 },
    {
      label: "Phương pháp giảng dạy",
      done: (tutor.teachingMethods?.length ?? 0) > 0,
    },
    {
      label: "Kinh nghiệm giảng dạy",
      done: (tutor.teachingHistory?.length ?? 0) > 0,
    },
    {
      label: "Học vấn và thành tích",
      done: (tutor.achievements?.length ?? 0) > 0,
    },
  ];
}

function TutorOwnProfileCompletion({ tutor }: { tutor: TutorProfileData }) {
  const items = getCompletionItems(tutor);
  const doneCount = items.filter((item) => item.done).length;
  const missing = items.filter((item) => !item.done);

  return (
    <section
      aria-label="Mức độ hoàn thiện hồ sơ"
      className="rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-extrabold text-foreground">
          Mức độ hoàn thiện
        </h2>
        <p className="text-sm font-black tabular-nums text-primary">
          {doneCount}/{items.length}
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={items.length}
        aria-valuenow={doneCount}
        aria-label="Mức độ hoàn thiện hồ sơ"
        className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-[var(--ease-soft)]"
          style={{ width: `${(doneCount / items.length) * 100}%` }}
        />
      </div>

      {missing.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {missing.map((item) => (
            <li key={item.label}>
              <Link
                href="/tutor/profile/edit"
                className="flex min-h-11 items-center justify-between gap-2 rounded-xl px-3 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Bổ sung {item.label.toLocaleLowerCase("vi")}
                <ChevronRightIcon
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <CheckCircleIcon
            className="size-5 shrink-0 text-secondary"
            aria-hidden="true"
          />
          Hồ sơ của bạn đã đầy đủ các mục.
        </p>
      )}
    </section>
  );
}

function TutorOwnProfilePanel({
  tutor,
  publicProfileHref,
}: {
  tutor: TutorProfileData;
  publicProfileHref: string;
}) {
  const rate = getTutorStartingRate(tutor);
  const availability = tutor.availability ?? [];

  return (
    <aside className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <div className="bg-[linear-gradient(135deg,#280f91_0%,#3213aa_62%,#447353_100%)] p-5 text-primary-foreground sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-highlight">
          Học phí của bạn
        </p>
        <p className="mt-2 text-3xl font-extrabold leading-none tabular-nums">
          {rate !== null ? `${rate.toLocaleString("vi-VN")}đ/giờ` : "Chưa cập nhật"}
        </p>
        <p className="mt-3 text-sm leading-6 text-primary-foreground">
          Đây là thông tin học viên và phụ huynh nhìn thấy trên hồ sơ công khai.
        </p>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <TutorOwnProfileCompletion tutor={tutor} />

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-foreground">
            <CalendarDaysIcon className="size-5 text-primary" aria-hidden="true" />
            Lịch có thể nhận lớp
          </h2>
          <div className="mt-3">
            {availability.length > 0 ? (
              <TutorAvailabilityList availability={availability} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Chưa thiết lập khung giờ nhận lớp.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Button
            asChild
            size="lg"
            className="h-12 w-full rounded-full bg-accent text-sm font-extrabold text-accent-foreground hover:bg-highlight"
          >
            <Link href="/tutor/profile/edit">
              <PencilSquareIcon className="size-5" aria-hidden="true" />
              Chỉnh sửa hồ sơ
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 w-full rounded-full text-sm font-bold"
          >
            <Link href={publicProfileHref} target="_blank">
              <EyeIcon className="size-5" aria-hidden="true" />
              Xem trang công khai
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}

function TutorOwnProfileSkeleton() {
  return (
    <div
      className="animate-pulse space-y-6"
      role="status"
      aria-label="Đang tải hồ sơ..."
    >
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <div className="h-2 bg-muted" />
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-8">
          <div className="size-32 shrink-0 rounded-3xl bg-muted sm:size-44 lg:size-56" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-48 rounded-full bg-muted" />
            <div className="h-10 w-72 rounded-lg bg-muted" />
            <div className="h-5 w-full max-w-md rounded bg-muted" />
            <div className="h-5 w-64 rounded bg-muted" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)] lg:items-start">
        <div className="space-y-5">
          <div className="h-48 rounded-2xl border border-border bg-card" />
          <div className="h-48 rounded-2xl border border-border bg-card" />
        </div>
        <div className="h-96 rounded-3xl border border-border bg-card" />
      </div>
    </div>
  );
}

function TutorOwnProfileError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft sm:p-12">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-destructive">
        <ExclamationCircleIcon className="size-7" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-xl font-black text-foreground">
        Không thể tải thông tin hồ sơ
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Đã có lỗi xảy ra trong quá trình tải hồ sơ gia sư từ hệ thống. Vui lòng
        thử lại.
      </p>
      <div className="mt-6 flex justify-center">
        <Button onClick={onRetry} className="h-11 rounded-full px-5 font-bold">
          <ArrowPathIcon className="size-[18px]" aria-hidden="true" />
          Thử lại
        </Button>
      </div>
    </div>
  );
}

function TutorOwnProfileEmpty() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft sm:p-12">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-primary">
        <UserMinusIcon className="size-7" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-xl font-black text-foreground">
        Chưa tìm thấy hồ sơ gia sư
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Tài khoản của bạn chưa có hồ sơ gia sư hoàn thiện hoặc hồ sơ chưa được
        kích hoạt trên hệ thống.
      </p>
      <div className="mt-6 flex justify-center">
        <Button asChild className="h-11 rounded-full px-5 font-bold">
          <Link href="/tutor/profile/edit">Cập nhật hồ sơ</Link>
        </Button>
      </div>
    </div>
  );
}

export function TutorOwnProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const isDevPreview = !user || user.id.startsWith("preview-");
  const tutorProfileId = user?.tutorProfileId || user?.id;

  const { data, isLoading, isError, refetch } = useTutorDetailQuery(
    tutorProfileId ?? "",
    { enabled: !isDevPreview && !!tutorProfileId },
  );

  const isProfileLoading =
    !isDevPreview && (isAuthLoading || (isLoading && !!tutorProfileId));

  if (isProfileLoading) {
    return <TutorOwnProfileSkeleton />;
  }

  if (!isDevPreview && isError) {
    return <TutorOwnProfileError onRetry={() => refetch()} />;
  }

  const tutorProfile = isDevPreview ? mockTutorProfile : data?.data;

  if (!tutorProfile) {
    return <TutorOwnProfileEmpty />;
  }

  const publicProfileHref = `/tutors/${encodeURIComponent(tutorProfile.id)}`;
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
    ...(hasAchievements
      ? [{ id: "thanh-tich", label: "Học vấn & thành tích" }]
      : []),
    { id: "danh-gia", label: "Đánh giá" },
  ];

  const panel = (
    <TutorOwnProfilePanel
      tutor={tutorProfile}
      publicProfileHref={publicProfileHref}
    />
  );

  return (
    <div className="space-y-5 sm:space-y-6">
      <TutorHero
        tutor={tutorProfile}
        actions={
          <>
            <Button asChild className="h-11 rounded-full px-5 font-bold">
              <Link href="/tutor/profile/edit">
                <PencilSquareIcon className="size-[18px]" aria-hidden="true" />
                Chỉnh sửa hồ sơ
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full px-5 font-bold"
            >
              <Link href={publicProfileHref} target="_blank">
                <EyeIcon className="size-[18px]" aria-hidden="true" />
                Xem trang công khai
              </Link>
            </Button>
          </>
        }
      />

      <div className="lg:hidden">{panel}</div>

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

        <div className="hidden lg:sticky lg:top-24 lg:block">{panel}</div>
      </div>
    </div>
  );
}
