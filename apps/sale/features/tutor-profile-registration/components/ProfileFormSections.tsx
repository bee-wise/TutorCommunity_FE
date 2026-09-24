"use client";

import { useEffect } from "react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { Plus, Trash } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import type { TutorProfileFormValues } from "../schemas/profile-registration.schema";
import { CatalogSelect } from "./CatalogSelect";
import { AvailabilityTimeRangeField } from "./AvailabilityTimeRangeField";
import { BankInformationField } from "./BankInformationField";
import { TeachingModeSelector } from "./TeachingModeSelector";
import { TeachingAreaFields } from "./TeachingAreaFields";
import { FileUploadField } from "./FileUploadField";
import {
  ProfileField,
  profileInputClass,
  profileTextareaClass,
} from "./ProfileField";

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-slate-100 pb-4">
      <h2 className="text-xl font-extrabold text-slate-950">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

export function BasicInformationSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TutorProfileFormValues>();
  return (
    <div className="space-y-5">
      <SectionHeading
        title="Thông tin cá nhân và học vấn"
        description="Thông tin rõ ràng giúp BeeWise xác minh hồ sơ nhanh hơn."
      />
      <div className="grid items-start gap-4 sm:grid-cols-2">
        <ProfileField
          label="Tên hiển thị"
          required
          error={errors.displayName?.message}
        >
          <input
            {...register("displayName")}
            className={profileInputClass}
            placeholder="Nguyễn Minh Anh"
          />
        </ProfileField>
        <ProfileField
          label="Ngày sinh"
          required
          error={errors.dateOfBirth?.message}
        >
          <input
            {...register("dateOfBirth")}
            type="date"
            className={profileInputClass}
          />
        </ProfileField>
        <ProfileField label="Giới tính" required error={errors.gender?.message}>
          <select {...register("gender")} className={profileInputClass}>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </select>
        </ProfileField>
        <ProfileField
          label="Năm học / tình trạng học tập"
          required
          error={errors.studentYear?.message}
        >
          <input
            {...register("studentYear")}
            className={profileInputClass}
            placeholder="Sinh viên năm 3 / Đã tốt nghiệp"
          />
        </ProfileField>
      </div>
      <ProfileField
        label="Giấy tờ tùy thân"
        hint="Ảnh giấy tờ chỉ dùng để xác minh danh tính."
      >
        <Controller
          control={control}
          name="identityDocumentsUrl"
          render={({ field }) => (
            <FileUploadField
              value={field.value}
              folder="documents"
              onChange={field.onChange}
            />
          )}
        />
      </ProfileField>
      <ProfileField
        label="Ảnh đại diện"
        hint="Ảnh vuông, rõ khuôn mặt và có ánh sáng tốt."
      >
        <Controller
          control={control}
          name="avatarUrl"
          render={({ field }) => (
            <FileUploadField
              value={field.value}
              folder="avatars"
              onChange={field.onChange}
            />
          )}
        />
      </ProfileField>
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <ProfileField
          label="Trường đại học"
          required
          error={errors.universityId?.message}
        >
          <Controller
            control={control}
            name="universityId"
            render={({ field }) => (
              <CatalogSelect
                resource="universities"
                value={field.value}
                onChange={(value) => field.onChange(String(value))}
                placeholder="Tìm trường đại học..."
              />
            )}
          />
        </ProfileField>
        <ProfileField
          label="Chuyên ngành"
          required
          error={errors.majorId?.message}
        >
          <Controller
            control={control}
            name="majorId"
            render={({ field }) => (
              <CatalogSelect
                resource="majors"
                value={field.value}
                onChange={(value) => field.onChange(String(value))}
                placeholder="Tìm chuyên ngành..."
              />
            )}
          />
        </ProfileField>
      </div>
      <ProfileField
        label="Thẻ sinh viên / bằng tốt nghiệp"
        hint="Tệp chỉ dùng cho mục đích xác minh, không hiển thị công khai."
      >
        <Controller
          control={control}
          name="studentCardUrl"
          render={({ field }) => (
            <FileUploadField
              value={field.value}
              folder="documents"
              onChange={field.onChange}
            />
          )}
        />
      </ProfileField>
    </div>
  );
}

export function TeachingInformationSection() {
  const {
    register,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<TutorProfileFormValues>();
  const subjectIds = useWatch({ control, name: "subjectIds" });
  const hourlyRate = useWatch({ control, name: "hourlyRate" });
  useEffect(() => {
    const current = new Map(
      hourlyRate.map((item) => [item.subjectId, item.price]),
    );
    const next = subjectIds.map((subjectId) => ({
      subjectId,
      price: current.get(subjectId) ?? 150000,
    }));
    if (JSON.stringify(next) !== JSON.stringify(hourlyRate)) {
      setValue("hourlyRate", next, { shouldDirty: true, shouldValidate: true });
    }
  }, [hourlyRate, setValue, subjectIds]);

  return (
    <div className="space-y-5">
      <SectionHeading
        title="Chuyên môn và học phí"
        description="Chọn đúng môn, cấp học và một mức phí cho từng môn."
      />
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <ProfileField
          label={<span className="inline-flex flex-wrap items-center gap-2">Môn giảng dạy <span className="text-xs font-normal text-slate-500">Có thể chọn nhiều</span></span>}
          required
          error={errors.subjectIds?.message}
        >
          <Controller
            control={control}
            name="subjectIds"
            render={({ field }) => (
              <CatalogSelect
                resource="subjects"
                multiple
                value={field.value}
                onChange={field.onChange}
                placeholder="Tìm môn dạy..."
              />
            )}
          />
        </ProfileField>
        <ProfileField
          label={<span className="inline-flex flex-wrap items-center gap-2">Cấp học <span className="text-xs font-normal text-slate-500">Có thể chọn nhiều</span></span>}
          required
          error={errors.gradeLevelIds?.message}
        >
          <Controller
            control={control}
            name="gradeLevelIds"
            render={({ field }) => (
              <CatalogSelect
                resource="grade_levels"
                multiple
                value={field.value}
                onChange={field.onChange}
                placeholder="Tìm cấp học..."
              />
            )}
          />
        </ProfileField>
      </div>
      <ProfileField label={<span className="inline-flex flex-wrap items-center gap-2">Chuyên môn nổi bật <span className="text-xs font-normal text-slate-500">Có thể chọn nhiều</span></span>}>
        <Controller
          control={control}
          name="specializationIds"
          render={({ field }) => (
            <CatalogSelect
              resource="specializations"
              multiple
              value={field.value}
              onChange={field.onChange}
              placeholder="Tìm chuyên môn..."
            />
          )}
        />
      </ProfileField>
      {subjectIds.length ? (
        <div className="grid items-start gap-3 rounded-xl bg-[#fff3cb]/60 p-4 sm:grid-cols-2">
          {subjectIds.map((subjectId, index) => (
            <ProfileField
              key={subjectId}
              label={`Học phí môn ${index + 1} (VNĐ/giờ)`}
              error={errors.hourlyRate?.[index]?.price?.message}
            >
              <input
                {...register(`hourlyRate.${index}.price`, {
                  valueAsNumber: true,
                })}
                type="number"
                min={1}
                step={10000}
                className={profileInputClass}
              />
            </ProfileField>
          ))}
        </div>
      ) : null}
      <div className="grid items-start gap-4 sm:grid-cols-2">
        <ProfileField
          label="Số năm kinh nghiệm"
          required
          error={errors.experienceYears?.message}
        >
          <input
            {...register("experienceYears", { valueAsNumber: true })}
            type="number"
            min={0}
            max={99}
            className={profileInputClass}
          />
        </ProfileField>
        <ProfileField
          label={
            <span className="inline-flex flex-wrap items-center gap-2">
              Hình thức dạy
              <span className="text-xs font-normal text-slate-500">
                Có thể chọn nhiều
              </span>
            </span>
          }
          required
          error={errors.teachingModes?.message}
        >
          <Controller
            control={control}
            name="teachingModes"
            render={({ field }) => (
              <TeachingModeSelector
                value={field.value}
                onChange={(next) => {
                  setValue("teachingModes", next, {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  void trigger(["teachingModes", "offlineCity"]);
                }}
              />
            )}
          />
        </ProfileField>
      </div>
    </div>
  );
}

export function IntroductionSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TutorProfileFormValues>();
  const methods = useFieldArray({ control, name: "teachingMethods" });
  return (
    <div className="space-y-5">
      <SectionHeading
        title="Giới thiệu và phương pháp"
        description="Viết cụ thể để học viên hiểu phong cách giảng dạy của bạn."
      />
      <ProfileField
        label="Tiêu đề hồ sơ"
        required
        error={errors.headline?.message}
      >
        <input
          {...register("headline")}
          className={profileInputClass}
          placeholder="Gia sư Toán THPT giúp học sinh lấy lại nền tảng"
        />
      </ProfileField>
      <ProfileField
        label="Giới thiệu ngắn"
        required
        error={errors.shortIntro?.message}
      >
        <textarea
          {...register("shortIntro")}
          className={profileTextareaClass}
          placeholder="Tóm tắt điểm mạnh và đối tượng học viên phù hợp..."
        />
      </ProfileField>
      <ProfileField
        label="Giới thiệu chi tiết"
        required
        error={errors.introduction?.message}
      >
        <textarea
          {...register("introduction")}
          className={`${profileTextareaClass} min-h-40`}
          placeholder="Chia sẻ kinh nghiệm, cách bạn xây dựng lộ trình và kết quả từng đạt được..."
        />
      </ProfileField>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Phương pháp giảng dạy</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => methods.append({ title: "", description: "" })}
          >
            <Plus /> Thêm
          </Button>
        </div>
        {methods.fields.map((item, index) => (
          <div
            key={item.id}
            className="grid items-start gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-[1fr_1.6fr_auto]"
          >
            <input
              {...register(`teachingMethods.${index}.title`)}
              className={profileInputClass}
              placeholder="Ví dụ: Học qua tình huống"
            />
            <input
              {...register(`teachingMethods.${index}.description`)}
              className={profileInputClass}
              placeholder="Mô tả cách áp dụng..."
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={methods.fields.length === 1}
              onClick={() => methods.remove(index)}
              aria-label="Xóa phương pháp"
            >
              <Trash />
            </Button>
          </div>
        ))}
        {errors.teachingMethods?.message ? (
          <p className="text-xs text-red-600">
            {errors.teachingMethods.message}
          </p>
        ) : null}
      </div>
      <ProfileField
        label="Video giới thiệu"
        hint="MP4, WebM hoặc MOV, tối đa 100 MB."
      >
        <Controller
          control={control}
          name="videoUrl"
          render={({ field }) => (
            <FileUploadField
              value={field.value}
              folder="intro-videos"
              kind="video"
              onChange={field.onChange}
            />
          )}
        />
      </ProfileField>
    </div>
  );
}

export function AvailabilityAndVerificationSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TutorProfileFormValues>();
  const availability = useFieldArray({ control, name: "availability" });
  const achievements = useFieldArray({ control, name: "achievements" });
  const teachingHistory = useFieldArray({ control, name: "teachingHistory" });
  const teachingModes = useWatch({ control, name: "teachingModes" });
  const requiresTeachingArea = teachingModes.includes("OFFLINE");
  return (
    <div className="space-y-5">
      <SectionHeading
        title="Khu vực, lịch dạy và xác minh"
        description="Thông tin xác minh được bảo mật và chỉ dùng để xét duyệt hồ sơ."
      />
      <TeachingAreaFields required={requiresTeachingArea} />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Lịch có thể dạy</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              availability.append({ day: "MONDAY", time: "18:00-20:00" })
            }
          >
            <Plus /> Thêm khung giờ
          </Button>
        </div>
        {availability.fields.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            Chưa có lịch dạy. Bạn có thể bổ sung sau.
          </p>
        ) : null}
        {availability.fields.map((item, index) => (
          <div
            key={item.id}
            className="grid gap-3 sm:grid-cols-[minmax(160px,0.7fr)_minmax(280px,1.3fr)_auto] sm:items-end"
          >
            <select
              {...register(`availability.${index}.day`)}
              className={profileInputClass}
            >
              <option value="MONDAY">Thứ Hai</option>
              <option value="TUESDAY">Thứ Ba</option>
              <option value="WEDNESDAY">Thứ Tư</option>
              <option value="THURSDAY">Thứ Năm</option>
              <option value="FRIDAY">Thứ Sáu</option>
              <option value="SATURDAY">Thứ Bảy</option>
              <option value="SUNDAY">Chủ Nhật</option>
            </select>
            <Controller
              control={control}
              name={`availability.${index}.time`}
              render={({ field }) => (
                <AvailabilityTimeRangeField
                  value={field.value}
                  error={errors.availability?.[index]?.time?.message}
                  onChange={field.onChange}
                />
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => availability.remove(index)}
              aria-label="Xóa khung giờ"
            >
              <Trash />
            </Button>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">
              Thành tích và chứng chỉ
            </h3>
            <p className="text-xs text-slate-500">
              Không bắt buộc, nhưng giúp hồ sơ đáng tin cậy hơn.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              achievements.append({
                id: crypto.randomUUID(),
                type: "CERTIFICATE",
                title: "",
                issuer: "",
                score: "",
                startDate: "",
                endDate: "",
                imageUrl: "",
                description: "",
              })
            }
          >
            <Plus /> Thêm
          </Button>
        </div>
        {achievements.fields.map((item, index) => (
          <div
            key={item.id}
            className="space-y-3 rounded-xl border border-slate-200 p-4"
          >
            <div className="grid items-start gap-3 sm:grid-cols-2">
              <input
                {...register(`achievements.${index}.title`)}
                className={profileInputClass}
                placeholder="Tên chứng chỉ / thành tích"
              />
              <input
                {...register(`achievements.${index}.issuer`)}
                className={profileInputClass}
                placeholder="Đơn vị cấp"
              />
              <input
                {...register(`achievements.${index}.score`)}
                className={profileInputClass}
                placeholder="Điểm / xếp loại"
              />
              <select
                {...register(`achievements.${index}.type`)}
                className={profileInputClass}
              >
                <option value="CERTIFICATE">Chứng chỉ</option>
                <option value="AWARD">Giải thưởng</option>
                <option value="ACADEMIC">Học thuật</option>
              </select>
              <input
                {...register(`achievements.${index}.startDate`)}
                type="date"
                className={profileInputClass}
              />
              <input
                {...register(`achievements.${index}.endDate`)}
                type="date"
                className={profileInputClass}
              />
            </div>
            <textarea
              {...register(`achievements.${index}.description`)}
              className={profileTextareaClass}
              placeholder="Mô tả ngắn về thành tích..."
            />
            <Controller
              control={control}
              name={`achievements.${index}.imageUrl`}
              render={({ field }) => (
                <FileUploadField
                  value={field.value}
                  folder="certificates"
                  onChange={field.onChange}
                />
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => achievements.remove(index)}
              className="text-red-600"
            >
              <Trash /> Xóa thành tích
            </Button>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Kinh nghiệm giảng dạy</h3>
            <p className="text-xs text-slate-500">
              Thêm lớp học, trung tâm hoặc hoạt động kèm học trước đây.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              teachingHistory.append({
                id: crypto.randomUUID(),
                title: "",
                organization: "",
                detail: "",
                outcome: "",
                startDate: "",
                endDate: "",
                isCurrent: false,
              })
            }
          >
            <Plus /> Thêm
          </Button>
        </div>
        {teachingHistory.fields.map((item, index) => (
          <div
            key={item.id}
            className="space-y-3 rounded-xl border border-slate-200 p-4"
          >
            <div className="grid items-start gap-3 sm:grid-cols-2">
              <input
                {...register(`teachingHistory.${index}.title`)}
                className={profileInputClass}
                placeholder="Vai trò / môn giảng dạy"
              />
              <input
                {...register(`teachingHistory.${index}.organization`)}
                className={profileInputClass}
                placeholder="Trung tâm / đơn vị / học viên cá nhân"
              />
              <input
                {...register(`teachingHistory.${index}.startDate`)}
                type="date"
                className={profileInputClass}
              />
              <input
                {...register(`teachingHistory.${index}.endDate`)}
                type="date"
                className={profileInputClass}
              />
            </div>
            <textarea
              {...register(`teachingHistory.${index}.detail`)}
              className={profileTextareaClass}
              placeholder="Mô tả công việc và đối tượng học viên..."
            />
            <input
              {...register(`teachingHistory.${index}.outcome`)}
              className={profileInputClass}
              placeholder="Kết quả nổi bật"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-normal">
                <input
                  type="checkbox"
                  {...register(`teachingHistory.${index}.isCurrent`)}
                />{" "}
                Hiện vẫn đang giảng dạy
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => teachingHistory.remove(index)}
                className="text-red-600"
              >
                <Trash /> Xóa
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-1.5">
        <p className="text-sm font-semibold text-slate-700">
          Thông tin ngân hàng
        </p>
        <Controller
          control={control}
          name="bankInformation"
          render={({ field }) => (
            <BankInformationField value={field.value} onChange={field.onChange} />
          )}
        />
      </div>
    </div>
  );
}
