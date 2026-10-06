"use client";

import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { Plus, Trash } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import type { TutorProfileFormValues } from "../schemas/profile-registration.schema";
import { STUDENT_YEAR_OPTIONS } from "../constants/student-year.constants";
import { CatalogSelect } from "./CatalogSelect";
import { AvailabilityTimeRangeField } from "./AvailabilityTimeRangeField";
import { BankInformationField } from "./BankInformationField";
import { BirthDatePicker } from "./BirthDatePicker";
import { TeachingOfferingsFields } from "./TeachingOfferingsFields";
import { TeachingAreaFields } from "./TeachingAreaFields";
import { FileUploadField } from "./FileUploadField";
import { ProfileSelect } from "./ProfileSelect";
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
    <div className="border-b border-border pb-4">
      <h2 className="text-xl font-extrabold text-foreground">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
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
        <div className="grid gap-1.5 text-sm font-semibold text-foreground">
          <label htmlFor="tutor-date-of-birth">
            Ngày sinh <span className="text-destructive">*</span>
          </label>
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <BirthDatePicker
                id="tutor-date-of-birth"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                invalid={Boolean(errors.dateOfBirth)}
              />
            )}
          />
          {errors.dateOfBirth?.message ? (
            <span id="tutor-date-of-birth-error" className="text-xs font-medium text-destructive">
              {errors.dateOfBirth.message}
            </span>
          ) : null}
        </div>
        <ProfileField label="Giới tính" required error={errors.gender?.message} interactive>
          <Controller control={control} name="gender" render={({ field }) => (
            <ProfileSelect
              label="Giới tính"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              invalid={Boolean(errors.gender)}
              placeholder="Chọn giới tính"
              options={[
                { value: "male", label: "Nam" },
                { value: "female", label: "Nữ" },
                { value: "others", label: "Khác" },
              ]}
            />
          )} />
        </ProfileField>
        <ProfileField
          label="Năm học / tình trạng học tập"
          required
          error={errors.studentYear?.message}
          interactive
        >
          <Controller control={control} name="studentYear" render={({ field }) => (
            <ProfileSelect
              label="Năm học / tình trạng học tập"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              invalid={Boolean(errors.studentYear)}
              placeholder="Chọn năm học / tình trạng học tập"
              options={STUDENT_YEAR_OPTIONS}
            />
          )} />
        </ProfileField>
      </div>
      <ProfileField
        label="Giấy tờ tùy thân"
        required
        interactive
        error={errors.identityDocumentsUrl?.message}
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
        required
        interactive
        error={errors.avatarUrl?.message}
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
          interactive
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
          interactive
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
        required
        interactive
        error={errors.studentCardUrl?.message}
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
    formState: { errors },
  } = useFormContext<TutorProfileFormValues>();

  return (
    <div className="space-y-5">
      <SectionHeading
        title="Chuyên môn và học phí"
        description="Tạo từng tổ hợp chương trình, môn dạy và cấp học với học phí riêng."
      />
      <TeachingOfferingsFields />
      <ProfileField
        label={
          <span className="inline-flex flex-wrap items-center gap-2">
            Chuyên môn nổi bật{" "}
            <span className="text-xs font-normal text-muted-foreground">
              Có thể chọn nhiều
            </span>
          </span>
        }
        interactive
      >
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
    </div>
  );
}

export function IntroductionSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TutorProfileFormValues>();
  const methods = useFieldArray({
    control,
    name: "teachingMethods",
    keyName: "fieldKey",
  });
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
          <div>
            <h3 className="font-bold text-foreground">Phương pháp giảng dạy</h3>
            <p className="text-xs text-muted-foreground">
              Không bắt buộc. Bạn có thể thêm các phương pháp giảng dạy đặc trưng của mình.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => methods.append({ title: "", description: "" })}
          >
            <Plus /> Thêm
          </Button>
        </div>
        {methods.fields.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
            Chưa có phương pháp giảng dạy nào. Nhấn &ldquo;Thêm&rdquo; nếu bạn muốn bổ sung.
          </div>
        ) : (
          methods.fields.map((item, index) => (
            <div
              key={item.fieldKey}
              className="grid items-start gap-3 rounded-xl border border-border p-4 sm:grid-cols-[1fr_1.6fr_auto]"
            >
              <div>
                <input
                  {...register(`teachingMethods.${index}.title`)}
                  className={profileInputClass}
                  placeholder="Ví dụ: Học qua tình huống"
                />
                {errors.teachingMethods?.[index]?.title?.message ? (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.teachingMethods[index]?.title?.message}
                  </p>
                ) : null}
              </div>
              <div>
                <input
                  {...register(`teachingMethods.${index}.description`)}
                  className={profileInputClass}
                  placeholder="Mô tả cách áp dụng..."
                />
                {errors.teachingMethods?.[index]?.description?.message ? (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.teachingMethods[index]?.description?.message}
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => methods.remove(index)}
                aria-label="Xóa phương pháp"
              >
                <Trash />
              </Button>
            </div>
          ))
        )}
        {errors.teachingMethods?.message ? (
          <p className="text-xs text-destructive">
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
  const availability = useFieldArray({
    control,
    name: "availability",
    keyName: "fieldKey",
  });
  const teachingHistory = useFieldArray({
    control,
    name: "teachingHistory",
    keyName: "fieldKey",
  });
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
          <h3 className="font-bold text-foreground">Lịch có thể dạy</h3>
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
          <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            Chưa có lịch dạy. Bạn có thể bổ sung sau.
          </p>
        ) : null}
        {availability.fields.map((item, index) => (
          <div
            key={item.fieldKey}
            className="grid gap-3 sm:grid-cols-[minmax(160px,0.7fr)_minmax(280px,1.3fr)_auto] sm:items-end"
          >
            <Controller control={control} name={`availability.${index}.day`} render={({ field }) => (
              <ProfileSelect
                label={`Thứ trong tuần, khung giờ ${index + 1}`}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Chọn thứ"
                options={[
                  { value: "MONDAY", label: "Thứ Hai" },
                  { value: "TUESDAY", label: "Thứ Ba" },
                  { value: "WEDNESDAY", label: "Thứ Tư" },
                  { value: "THURSDAY", label: "Thứ Năm" },
                  { value: "FRIDAY", label: "Thứ Sáu" },
                  { value: "SATURDAY", label: "Thứ Bảy" },
                  { value: "SUNDAY", label: "Chủ Nhật" },
                ]}
              />
            )} />
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
            <h3 className="font-bold text-foreground">Kinh nghiệm giảng dạy</h3>
            <p className="text-xs text-muted-foreground">
              Thêm lớp học, trung tâm hoặc hoạt động kèm học trước đây.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              teachingHistory.append({
                id: "",
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
            key={item.fieldKey}
            className="space-y-3 rounded-xl border border-border p-4"
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
                className="text-destructive"
              >
                <Trash /> Xóa
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-1.5">
        <p className="text-sm font-semibold text-foreground">
          Thông tin ngân hàng
        </p>
        <Controller
          control={control}
          name="bankInformation"
          render={({ field }) => (
            <BankInformationField
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
}
