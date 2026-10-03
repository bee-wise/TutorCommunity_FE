"use client";

import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Plus, Trash } from "@phosphor-icons/react";
import { ApiError } from "@workspace/core/sys-libs/error-handler";
import { Button } from "@workspace/ui/components/ui/button";
import {
  emptyTeachingOffering,
  type TeachingOfferingFormValue,
  type TutorProfileFormValues,
} from "../schemas/profile-registration.schema";
import { useLearningProgramOptions } from "../hooks/useLearningProgramOptions";
import type { LearningCatalogItem } from "../services/learning-programs.service";
import { ProfileField, profileInputClass } from "./ProfileField";
import { ProfileSelect } from "./ProfileSelect";

function optionName(item: LearningCatalogItem): string {
  return item.name || item.code || "Chưa có tên";
}

function TeachingOfferingCard({
  index,
  count,
  onRemove,
}: {
  index: number;
  count: number;
  onRemove: () => void;
}) {
  const {
    control,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<TutorProfileFormValues>();
  const offering =
    useWatch({ control, name: `teachingOfferings.${index}` }) ??
    emptyTeachingOffering;
  const { programs, contexts, teachingItems } = useLearningProgramOptions(
    offering.programId,
    offering.programVersionId,
    offering.contextSelection,
  );
  const fieldErrors = errors.teachingOfferings?.[index];
  const publishedVersionId = contexts.data?.programVersionId ?? "";
  const catalogReady =
    contexts.isSuccess && !contexts.isFetching && Boolean(publishedVersionId);
  const versionMatches =
    catalogReady && offering.programVersionId === publishedVersionId;

  useEffect(() => {
    if (!offering.programId || !contexts.isSuccess || contexts.isFetching) return;
    const nextVersionId = contexts.data?.programVersionId ?? "";
    if (offering.programVersionId === nextVersionId) return;
    const versionChanged = Boolean(offering.programVersionId);
    setValue(
      `teachingOfferings.${index}`,
      {
        ...offering,
        programVersionId: nextVersionId,
        ...(versionChanged
          ? {
              contextSelection: "",
              teachingItemId: "",
              proposedContextName: "",
              proposedTeachingItemName: "",
              id: null,
            }
          : {}),
      },
      { shouldDirty: versionChanged, shouldValidate: true },
    );
  }, [
    contexts.data,
    contexts.isFetching,
    contexts.isSuccess,
    index,
    offering,
    offering.programId,
    offering.programVersionId,
    setValue,
  ]);

  const update = (changes: Partial<TeachingOfferingFormValue>) => {
    setValue(
      `teachingOfferings.${index}`,
      { ...offering, ...changes },
      { shouldDirty: true, shouldTouch: true, shouldValidate: true },
    );
  };
  const contextOptions = contexts.data?.contexts ?? [];
  const contextSelected =
    offering.contextSelection === "__proposal__"
      ? offering.proposedContextName.trim().length >= 2
      : offering.contextSelection === "__none__"
        ? Boolean(contexts.data?.hasWithoutContext)
        : contextOptions.some((item) => item.id === offering.contextSelection);
  const availableTeachingItems = teachingItems.data ?? [];
  const selectedTeachingItem = availableTeachingItems.find(
    (item) => (item.teachingItemId ?? item.id) === offering.teachingItemId,
  );
  const itemSelected =
    offering.teachingItemId === "__proposal__"
      ? offering.proposedTeachingItemName.trim().length >= 2
      : Boolean(selectedTeachingItem);
  const showPrice =
    versionMatches &&
    contextSelected &&
    itemSelected &&
    teachingItems.isSuccess &&
    !teachingItems.isFetching;
  const versionConflict =
    teachingItems.error instanceof ApiError &&
    [404, 409].includes(teachingItems.error.statusCode);

  return (
    <div className="min-w-0 space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <p className="text-sm font-bold text-primary">Môn dạy {index + 1}</p>
          <p className="text-xs text-muted-foreground">
            Chọn chương trình, cấp học, môn dạy và học phí riêng.
          </p>
        </div>
        {count > 1 ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            aria-label={`Xóa tổ hợp ${index + 1}`}
          >
            <Trash className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <div className="grid min-w-0 items-start gap-4 sm:grid-cols-2">
        <ProfileField
          label="Chương trình"
          required
          error={fieldErrors?.programId?.message}
          interactive
        >
          <ProfileSelect
            value={offering.programId}
            onChange={(programId) =>
              update({
                programId,
                programVersionId: "",
                teachingItemId: "",
                contextSelection: "",
                proposedTeachingItemName: "",
                proposedContextName: "",
                proposedContextType: "OTHER",
                id: null,
              })
            }
            label="Chương trình"
            invalid={Boolean(fieldErrors?.programId)}
            searchPlaceholder="Tìm chương trình..."
            disabled={programs.isPending || programs.isError}
            placeholder={programs.isPending
                ? "Đang tải chương trình..."
                : "Chọn chương trình"}
            options={(programs.data ?? []).map((item) => ({ value: item.id, label: optionName(item) }))}
          />
          {programs.isError ? (
            <p className="text-xs text-destructive">
              Không tải được chương trình.
            </p>
          ) : null}
          {programs.isSuccess && !programs.data.length ? (
            <p className="text-xs text-muted-foreground">
              BeeWise chưa mở chương trình giảng dạy nào.
            </p>
          ) : null}
          {offering.programId &&
          ((contexts.isSuccess && !contexts.data) ||
            (contexts.error instanceof ApiError &&
              contexts.error.statusCode === 404)) ? (
            <p className="text-xs text-destructive">
              Chương trình chưa có phiên bản được xuất bản.
            </p>
          ) : null}
        </ProfileField>

        <ProfileField
          label="Cấp học"
          required
          error={fieldErrors?.contextSelection?.message}
          interactive
        >
          <ProfileSelect
            value={offering.contextSelection}
            onChange={(contextSelection) =>
              update({
                contextSelection,
                teachingItemId: "",
                proposedTeachingItemName: "",
                proposedContextName: "",
                proposedContextType: "OTHER",
                id: null,
              })
            }
            label="Cấp học"
            invalid={Boolean(fieldErrors?.contextSelection)}
            searchPlaceholder="Tìm cấp học / ngữ cảnh..."
            disabled={!versionMatches}
            placeholder={contexts.isPending || contexts.isFetching
                ? "Đang tải cấp học..."
                : "Chọn cấp học"}
            options={[
              ...contextOptions.map((item) => ({ value: item.id, label: optionName(item) })),
              ...(contexts.data?.hasWithoutContext ? [{ value: "__none__", label: "Không áp dụng cấp học" }] : []),
              { value: "__proposal__", label: "+ Đề xuất cấp học mới chưa có" },
            ]}
          />
          {contexts.isError &&
          !(contexts.error instanceof ApiError &&
            contexts.error.statusCode === 404) ? (
            <p className="text-xs text-destructive">
              Không tải được danh mục cấp học.
            </p>
          ) : null}
        </ProfileField>
      </div>

      {offering.contextSelection === "__proposal__" ? (
        <div className="grid min-w-0 items-start gap-4 sm:grid-cols-2">
          <ProfileField
            label="Cấp học đề xuất"
            required
            error={fieldErrors?.proposedContextName?.message}
          >
            <input
              value={offering.proposedContextName}
              onChange={(event) =>
                update({ proposedContextName: event.target.value })
              }
              className={profileInputClass}
              placeholder="Ví dụ: Ôn thi vào 10"
            />
          </ProfileField>
          <ProfileField label="Loại ngữ cảnh" interactive>
            <ProfileSelect
              value={offering.proposedContextType}
              onChange={(value) =>
                update({
                  proposedContextType: value as TeachingOfferingFormValue["proposedContextType"],
                })
              }
              label="Loại ngữ cảnh"
              placeholder="Chọn loại ngữ cảnh"
              options={[
                { value: "GRADE", label: "Lớp học" },
                { value: "LEVEL", label: "Trình độ" },
                { value: "MAJOR", label: "Chuyên ngành" },
                { value: "EXAM_TRACK", label: "Hướng luyện thi" },
                { value: "CERT_LEVEL", label: "Cấp chứng chỉ" },
                { value: "OTHER", label: "Khác" },
              ]}
            />
          </ProfileField>
        </div>
      ) : null}

      {contextSelected ? (
        <ProfileField
          label="Môn / nội dung dạy"
          required
          error={fieldErrors?.teachingItemId?.message}
          interactive
        >
          <ProfileSelect
            value={offering.teachingItemId}
            onChange={(teachingItemId) =>
              update({
                teachingItemId,
                proposedTeachingItemName: "",
                id: null,
              })
            }
            label="Môn / nội dung dạy"
            invalid={Boolean(fieldErrors?.teachingItemId)}
            searchPlaceholder="Tìm môn / nội dung dạy..."
            disabled={!versionMatches || teachingItems.isFetching || teachingItems.isPending || teachingItems.isError}
            placeholder={teachingItems.isPending ? "Đang tải môn / nội dung..." : "Chọn môn / nội dung"}
            options={[
              ...(offering.teachingItemId &&
            offering.teachingItemId !== "__proposal__" &&
            teachingItems.isSuccess &&
            !selectedTeachingItem ? [{ value: offering.teachingItemId, label: "Môn đã chọn không còn trong tổ hợp này", disabled: true }] : []),
              ...availableTeachingItems.map((item) => ({ value: item.teachingItemId ?? item.id, label: optionName(item) })),
              { value: "__proposal__", label: "+ Đề xuất môn / nội dung mới" },
            ]}
          />
          {versionConflict ? (
            <p className="text-xs text-destructive">
              Phiên bản chương trình đã thay đổi. Hãy tải lại cấp học và chọn lại môn.
            </p>
          ) : null}
          {teachingItems.isError && !versionConflict ? (
            <p className="text-xs text-destructive">
              Không tải được danh mục môn học.
            </p>
          ) : null}
          {!availableTeachingItems.length && teachingItems.isSuccess ? (
            <p className="text-xs text-muted-foreground">
              Chưa có môn được cấu hình cho cấp học này. Bạn có thể đề xuất môn
              mới.
            </p>
          ) : null}
        </ProfileField>
      ) : null}

      {offering.teachingItemId === "__proposal__" && contextSelected ? (
        <ProfileField
          label="Tên môn / nội dung đề xuất"
          required
          error={fieldErrors?.proposedTeachingItemName?.message}
        >
          <input
            value={offering.proposedTeachingItemName}
            onChange={(event) =>
              update({ proposedTeachingItemName: event.target.value })
            }
            className={profileInputClass}
            placeholder="Ví dụ: SAT Math"
          />
        </ProfileField>
      ) : null}

      {showPrice ? (
        <div className="grid min-w-0 items-start gap-4 rounded-xl bg-accent/15 p-4 sm:grid-cols-2">
          <ProfileField
            label="Hình thức dạy"
            required
            error={fieldErrors?.teachingMode?.message}
            interactive
          >
            <ProfileSelect
              value={offering.teachingMode}
              onChange={(value) =>
                update({
                  teachingMode: value as TeachingOfferingFormValue["teachingMode"],
                  id: null,
                })
              }
              label="Hình thức dạy"
              placeholder="Chọn hình thức dạy"
              options={[
                { value: "ONLINE", label: "Trực tuyến" },
                { value: "OFFLINE", label: "Trực tiếp" },
              ]}
            />
          </ProfileField>
          <ProfileField
            label="Học phí (VNĐ/giờ)"
            required
            error={fieldErrors?.basePrice?.message}
          >
            <div className="relative">
              <input
                {...register(`teachingOfferings.${index}.basePrice`, {
                  valueAsNumber: true,
                })}
                type="number"
                min={1}
                step={10000}
                inputMode="numeric"
                placeholder="Ví dụ: 150000"
                className={`${profileInputClass} pr-14`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                VNĐ
              </span>
            </div>
          </ProfileField>
        </div>
      ) : null}
      {programs.isError ||
      contexts.isError ||
      teachingItems.isError ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            if (programs.isError) void programs.refetch();
            if (contexts.isError) void contexts.refetch();
            if (versionConflict) void contexts.refetch();
            else if (teachingItems.isError) void teachingItems.refetch();
          }}
        >
          Thử tải lại danh mục
        </Button>
      ) : null}
    </div>
  );
}

export function TeachingOfferingsFields() {
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<TutorProfileFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "teachingOfferings",
    keyName: "fieldKey",
  });
  const offerings = useWatch({ control, name: "teachingOfferings" });

  useEffect(() => {
    const next = [...new Set(offerings.map((item) => item.teachingMode))];
    const current = getValues("teachingModes");
    if (JSON.stringify(current) !== JSON.stringify(next)) {
      setValue("teachingModes", next.length ? next : ["ONLINE"], {
        shouldValidate: true,
      });
    }
  }, [getValues, offerings, setValue]);

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <TeachingOfferingCard
          key={field.fieldKey}
          index={index}
          count={fields.length}
          onRemove={() => remove(index)}
        />
      ))}
      {typeof errors.teachingOfferings?.message === "string" ? (
        <p className="text-xs font-medium text-destructive">
          {errors.teachingOfferings.message}
        </p>
      ) : null}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ ...emptyTeachingOffering })}
        className="w-full border-dashed text-primary sm:w-auto"
      >
        <Plus className="h-4 w-4" /> Thêm môn dạy {fields.length + 1}
      </Button>
      <p className="text-xs leading-5 text-muted-foreground">
        Hoàn tất tổ hợp và nhập học phí để lưu tổ hợp đó vào bản nháp.
      </p>
    </div>
  );
}
