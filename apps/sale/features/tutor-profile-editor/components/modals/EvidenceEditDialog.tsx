"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import Image from "next/image";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { TutorProfileEditorValues } from "../../schemas/profile-editor.schema";
import { isLocalPreviewUrl, validatePreviewFile } from "../../utils/file-preview";
import { ProfileBlockDialog } from "../ProfileBlockDialog";
import { ProfileField } from "../ProfileField";
import {
  RepeaterError,
  RepeaterHeader,
  RepeaterItem,
} from "../RepeaterPrimitives";

const imageRule = {
  acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
  maxBytes: 10 * 1024 * 1024,
};

function EvidenceFields({
  fileErrors,
  onFileChange,
  onRemove,
}: {
  fileErrors: Record<number, string>;
  onFileChange: (index: number, file?: File) => void;
  onRemove: (index: number, imageUrl: string, removeField: (index: number) => void) => void;
}) {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<TutorProfileEditorValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "certificates" });
  const certificates = watch("certificates");

  return (
    <div className="grid gap-4">
      <RepeaterHeader
        label="Minh chứng"
        description="Tách riêng tên, loại, trạng thái và mô tả công khai cho từng minh chứng."
        addLabel="Thêm minh chứng"
        reviewRequired
        onAdd={() =>
          append({
            title: "",
            type: "",
            imageUrl: "/images/TutorEvidence/certi-1.png",
            status: "Chờ xác minh",
            description: "",
          })
        }
      />
      {fields.map((field, index) => {
        const imageUrl = certificates[index]?.imageUrl ?? field.imageUrl;
        return (
          <RepeaterItem
            key={field.id}
            title={`Minh chứng ${index + 1}`}
            canRemove={fields.length > 1}
            onRemove={() => onRemove(index, imageUrl, remove)}
          >
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-[144px_minmax(0,1fr)] sm:items-center">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#cfe1fa] bg-white">
                  <Image
                    src={imageUrl}
                    alt={`Xem trước minh chứng ${index + 1}`}
                    fill
                    unoptimized={isLocalPreviewUrl(imageUrl)}
                    sizes="144px"
                    className="object-contain p-2"
                  />
                </div>
                <div>
                  <label htmlFor={`evidence-file-${index}`} className="text-sm font-bold text-[#17142f]">
                    Tệp hình ảnh
                  </label>
                  <p className="mt-1 text-xs leading-5 text-[#56516a]">
                    JPG, PNG hoặc WEBP, tối đa 10 MB.
                  </p>
                  <input
                    id={`evidence-file-${index}`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => onFileChange(index, event.target.files?.[0])}
                    className="mt-2 block w-full text-xs text-[#56516a] file:mr-3 file:rounded-full file:border-0 file:bg-[#280f91]/10 file:px-3 file:py-2 file:font-bold file:text-[#280f91]"
                  />
                  {fileErrors[index] ? (
                    <p role="alert" className="mt-2 text-xs font-semibold text-[#9f2017]">
                      {fileErrors[index]}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileField
                  id={`certificate-${index}-title`}
                  label="Tên"
                  error={errors.certificates?.[index]?.title}
                  registration={register(`certificates.${index}.title`)}
                />
                <ProfileField
                  id={`certificate-${index}-type`}
                  label="Loại"
                  error={errors.certificates?.[index]?.type}
                  registration={register(`certificates.${index}.type`)}
                />
              </div>
              <div className="rounded-xl border border-[#cfe1fa] bg-white px-3 py-3">
                <p className="text-xs font-bold text-[#56516a]">Trạng thái</p>
                <p className="mt-1 text-sm font-extrabold text-[#17142f]">{field.status}</p>
                <p className="mt-1 text-xs leading-5 text-[#716c83]">Trạng thái do BeeWise cập nhật sau khi xét duyệt.</p>
              </div>
              <ProfileField
                id={`certificate-${index}-description`}
                label="Mô tả công khai"
                error={errors.certificates?.[index]?.description}
                registration={register(`certificates.${index}.description`)}
                multiline
                rows={3}
              />
            </div>
          </RepeaterItem>
        );
      })}
      <RepeaterError message={errors.certificates?.root?.message} />
    </div>
  );
}

function EvidenceDialogContent({
  generatedUrls,
}: {
  generatedUrls: MutableRefObject<Set<string>>;
}) {
  const { setValue } = useFormContext<TutorProfileEditorValues>();
  const [fileErrors, setFileErrors] = useState<Record<number, string>>({});

  const handleFileChange = (index: number, file?: File) => {
    if (!file) return;
    const error = validatePreviewFile(file, imageRule);
    setFileErrors((current) => ({ ...current, [index]: error ?? "" }));
    if (error) return;
    const url = URL.createObjectURL(file);
    generatedUrls.current.add(url);
    setValue(`certificates.${index}.imageUrl`, url, { shouldDirty: true });
  };

  return (
    <EvidenceFields
      fileErrors={fileErrors}
      onFileChange={handleFileChange}
      onRemove={(index, imageUrl, removeField) => {
        if (imageUrl && generatedUrls.current.has(imageUrl)) {
          URL.revokeObjectURL(imageUrl);
          generatedUrls.current.delete(imageUrl);
        }
        removeField(index);
      }}
    />
  );
}

export function EvidenceEditDialog({
  profile,
  onClose,
  onSave,
}: {
  profile: TutorProfileEditorValues;
  onClose: () => void;
  onSave: (values: TutorProfileEditorValues) => void;
}) {
  const generatedUrls = useRef(new Set<string>());
  const committed = useRef(false);

  useEffect(
    () => () => {
      if (!committed.current) {
        generatedUrls.current.forEach((url) => URL.revokeObjectURL(url));
      }
    },
    [],
  );

  return (
    <ProfileBlockDialog
      open
      title="Chỉnh sửa minh chứng"
      description="Tải ảnh và mô tả từng minh chứng. Trạng thái xét duyệt không thể chỉnh sửa."
      profile={profile}
      onClose={onClose}
      onSave={(values) => {
        committed.current = true;
        onSave(values);
      }}
    >
      <EvidenceDialogContent generatedUrls={generatedUrls} />
    </ProfileBlockDialog>
  );
}
