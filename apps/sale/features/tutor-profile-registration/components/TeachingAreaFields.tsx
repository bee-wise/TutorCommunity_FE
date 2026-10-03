"use client";

import { useEffect } from "react";
import { MapPin, WarningCircle } from "@phosphor-icons/react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@workspace/ui/components/ui/button";
import {
  useVietnamProvince,
  useVietnamProvinces,
} from "../hooks/useVietnamAdministrativeDivisions";
import type { TutorProfileFormValues } from "../schemas/profile-registration.schema";
import type {
  VietnamProvince,
  VietnamWard,
} from "../services/vietnam-administrative.service";
import { ProfileField, profileInputClass } from "./ProfileField";
import { ProfileSelect } from "./ProfileSelect";

const LEGACY_VALUE = "__legacy_location__";

function normalizeDivisionName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi")
    .replace(/đ/g, "d")
    .replace(/^(tinh|thanh pho|tp)\.?\s+/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function findProvince(
  provinces: VietnamProvince[],
  savedName: string,
): VietnamProvince | undefined {
  const normalized = normalizeDivisionName(savedName);
  return provinces.find(
    (province) => normalizeDivisionName(province.name) === normalized,
  );
}

function findWard(
  wards: VietnamWard[],
  savedName: string,
): VietnamWard | undefined {
  const normalized = normalizeDivisionName(savedName);
  return wards.find((ward) => normalizeDivisionName(ward.name) === normalized);
}

function areaLabel(city: string, ward: string): string {
  return [ward, city].filter(Boolean).join(", ");
}

export function TeachingAreaFields({ required }: { required: boolean }) {
  const {
    control,
    register,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<TutorProfileFormValues>();
  const city = useWatch({ control, name: "offlineCity" });
  const ward = useWatch({ control, name: "offlineWard" });
  const area = useWatch({ control, name: "area" });

  const provincesQuery = useVietnamProvinces();
  const provinces = provincesQuery.data ?? [];
  const selectedProvince = findProvince(provinces, city);
  const provinceQuery = useVietnamProvince(selectedProvince?.code);
  const wards = provinceQuery.data?.wards ?? [];
  const selectedWard = findWard(wards, ward);

  useEffect(() => {
    const normalizedArea = areaLabel(city, ward);
    if (normalizedArea && normalizedArea !== area) {
      setValue("area", normalizedArea);
    }
  }, [area, city, setValue, ward]);

  const selectProvince = (codeValue: string) => {
    const province = provinces.find(
      (item) => String(item.code) === codeValue,
    );
    const nextCity = province?.name ?? "";
    setValue("offlineCity", nextCity, { shouldDirty: true });
    setValue("offlineWard", "", { shouldDirty: true });
    setValue("offlineDistrict", "", { shouldDirty: true });
    setValue("area", nextCity, { shouldDirty: true });
    void trigger(["offlineCity", "area"]);
  };

  const selectWard = (codeValue: string) => {
    const nextWard =
      wards.find((item) => String(item.code) === codeValue)?.name ?? "";
    setValue("offlineWard", nextWard, { shouldDirty: true });
    setValue("offlineDistrict", "", { shouldDirty: true });
    setValue("area", areaLabel(city, nextWard), { shouldDirty: true });
  };

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-muted/40 p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MapPin className="size-5" weight="fill" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-bold text-foreground">Khu vực giảng dạy</h3>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
            Dữ liệu hành chính hai cấp sau tháng 07/2025. Có thể chọn toàn tỉnh
            hoặc thu hẹp đến phường, xã.
          </p>
        </div>
      </div>

      <div className="grid items-start gap-4 sm:grid-cols-2">
        <ProfileField
          label="Tỉnh / thành phố"
          required={required}
          error={errors.offlineCity?.message}
          interactive
        >
          <ProfileSelect
            value={
              selectedProvince
                ? String(selectedProvince.code)
                : city
                  ? LEGACY_VALUE
                  : ""
            }
            onChange={selectProvince}
            disabled={provincesQuery.isLoading || provincesQuery.isError}
            label="Tỉnh / thành phố"
            invalid={Boolean(errors.offlineCity)}
            searchable
            searchPlaceholder="Tìm tỉnh / thành phố..."
            placeholder={provincesQuery.isLoading
                ? "Đang tải tỉnh / thành phố..."
                : "Chọn tỉnh / thành phố"}
            options={[
              ...(city && !selectedProvince ? [{ value: LEGACY_VALUE, label: `${city} (dữ liệu đã lưu)`, disabled: true }] : []),
              ...provinces.map((province) => ({ value: String(province.code), label: province.name })),
            ]}
          />
        </ProfileField>

        <ProfileField label="Phường / xã / đặc khu" interactive>
          <ProfileSelect
            value={
              selectedWard ? String(selectedWard.code) : ward ? LEGACY_VALUE : ""
            }
            onChange={selectWard}
            disabled={!selectedProvince || provinceQuery.isLoading || provinceQuery.isError}
            label="Phường / xã / đặc khu"
            searchable
            searchPlaceholder="Tìm phường / xã..."
            placeholder={provinceQuery.isLoading
                ? "Đang tải phường / xã..."
                : selectedProvince
                  ? "Toàn tỉnh / thành phố"
                  : "Chọn tỉnh / thành phố trước"}
            options={[
              { value: "", label: "Toàn tỉnh / thành phố" },
              ...(ward && !selectedWard ? [{ value: LEGACY_VALUE, label: `${ward} (dữ liệu đã lưu)`, disabled: true }] : []),
              ...wards.map((item) => ({ value: String(item.code), label: item.name })),
            ]}
          />
        </ProfileField>

        <ProfileField label="Địa chỉ chi tiết">
          <input
            {...register("offlineAddressDetail")}
            className={profileInputClass}
            placeholder="Tên đường, số nhà hoặc địa điểm gặp"
          />
        </ProfileField>

        <ProfileField label="Bán kính di chuyển (km)">
          <input
            {...register("travelRadiusKm", { valueAsNumber: true })}
            type="number"
            min={0}
            max={100}
            className={profileInputClass}
          />
        </ProfileField>
      </div>

      {provincesQuery.isError || provinceQuery.isError ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-accent/40 bg-accent/20 px-3 py-2.5 text-sm text-amber-800">
          <span className="flex items-start gap-2">
            <WarningCircle className="mt-0.5 size-4 shrink-0" weight="fill" />
            Chưa tải được dữ liệu khu vực. Vui lòng thử lại.
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (provincesQuery.isError) void provincesQuery.refetch();
              if (provinceQuery.isError) void provinceQuery.refetch();
            }}
          >
            Thử lại
          </Button>
        </div>
      ) : null}

      {city ? (
        <p className="rounded-xl bg-primary/10 border border-primary/20 px-3 py-2 text-xs leading-5 text-primary">
          Khu vực hiển thị: <strong>{areaLabel(city, ward)}</strong>
        </p>
      ) : null}
    </div>
  );
}
