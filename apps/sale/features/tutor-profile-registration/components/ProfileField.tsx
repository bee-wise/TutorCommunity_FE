"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { TutorProfileReview } from "../schemas/profile-review.schema";

type RejectedField = TutorProfileReview["rejectedFields"][number];

const ProfileReviewContext = createContext<readonly RejectedField[]>([]);

export function ProfileReviewHighlightProvider({
  rejectedFields,
  children,
}: {
  rejectedFields: readonly RejectedField[];
  children: ReactNode;
}) {
  return (
    <ProfileReviewContext.Provider value={rejectedFields}>
      {children}
    </ProfileReviewContext.Provider>
  );
}

const OFFERING_FIELDS = new Set([
  "teachingOfferings",
  "subjectIds",
  "gradeLevelIds",
  "hourlyRate",
  "teachingModes",
]);

export function useProfileReviewRejection(fieldName?: string, offeringId?: string) {
  const rejectedFields = useContext(ProfileReviewContext);
  if (!fieldName) return undefined;
  return rejectedFields.find((field) => {
    const root = field.fieldName.split(/[.[\]]+/).find(Boolean);
    const matches = fieldName === "teachingOfferings"
      ? root !== undefined && OFFERING_FIELDS.has(root)
      : root === fieldName;
    return matches && (!field.offeringId || field.offeringId === offeringId);
  });
}

export function ProfileReviewHighlight({
  fieldName,
  offeringId,
  className = "",
  children,
}: {
  fieldName: string;
  offeringId?: string;
  className?: string;
  children: ReactNode;
}) {
  const rejection = useProfileReviewRejection(fieldName, offeringId);
  return (
    <div
      id={`profile-review-field-${fieldName}`}
      tabIndex={-1}
      className={`${className} scroll-mt-28 focus:outline-none focus:ring-2 focus:ring-destructive/70 focus:ring-offset-2 ${rejection ? "rounded-xl border border-destructive/40 bg-destructive/5 p-3" : ""}`}
    >
      {rejection ? (
        <p className="mb-2 text-xs font-semibold leading-5 text-destructive">
          Cần chỉnh sửa theo phản hồi: {rejection.rejectionReason}
        </p>
      ) : null}
      {children}
    </div>
  );
}

export function ProfileField({
  label,
  error,
  hint,
  required = false,
  children,
  className,
  interactive = false,
  reviewField,
}: {
  label: ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  reviewField?: string;
}) {
  const Tag = interactive ? "div" : "label";
  const rejection = useProfileReviewRejection(reviewField);
  return (
    <Tag
      id={reviewField ? `profile-review-field-${reviewField}` : undefined}
      tabIndex={reviewField ? -1 : undefined}
      className={`flex flex-col justify-start gap-1.5 text-sm font-semibold text-foreground ${reviewField ? "scroll-mt-28 focus:outline-none focus:ring-2 focus:ring-destructive/70 focus:ring-offset-2" : ""} ${rejection ? "rounded-xl border border-destructive/40 bg-destructive/5 p-3" : ""} ${className ?? ""}`}
    >
      <span>
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </span>
      {children}
      {error ? <span className="text-xs font-medium text-destructive">{error}</span> : null}
      {rejection ? (
        <span className="text-xs font-normal leading-5 text-destructive">
          Cần chỉnh sửa theo phản hồi: {rejection.rejectionReason}
        </span>
      ) : null}
      {!error && hint ? <span className="text-xs font-normal leading-5 text-muted-foreground">{hint}</span> : null}
    </Tag>
  );
}

export const profileInputClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-3 focus:ring-primary/10 disabled:bg-muted";

export const profileTextareaClass =
  "min-h-28 w-full resize-y rounded-xl border border-border bg-card px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-3 focus:ring-primary/10";

