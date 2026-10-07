"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import {
  Bank,
  CaretDown,
  Check,
  CheckCircle,
  MagnifyingGlass,
  Plus,
  Spinner,
  Trash,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@workspace/ui/components/ui/button";
import { Input } from "@workspace/ui/components/ui/input";
import { useTutorOnboardingViewModel } from "../TutorOnboardingProvider";
import {
  AVAILABILITY_DAYS,
  AvailabilityDaySelect,
  AvailabilityTimePicker,
} from "../AvailabilityControls";
import { useTutorReadiness } from "../../hooks/useTutorReadiness";
import type {
  ReadinessAvailability,
  ReadinessBank,
  ReadinessDetails,
} from "../../api/tutor-readiness.api";
import {
  getVietQRBanks,
  lookupVietQRAccount,
  type VietQRBank,
} from "../../api/vietqr.api";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

type AvailabilityRow = ReadinessAvailability & { id: string };

export function PostApprovalScreen() {
  const { state, dispatchAction, isPreview } = useTutorOnboardingViewModel();
  const { readiness, save } = useTutorReadiness(!isPreview);
  const status = readiness.data;

  // Bank form state
  const [banks, setBanks] = useState<VietQRBank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);
  const [selectedBank, setSelectedBank] = useState<VietQRBank | null>(null);
  const [bankSearch, setBankSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [accountNumber, setAccountNumber] = useState(
    isPreview ? state.bankInfo.accountNumber : "",
  );
  const [accountHolder, setAccountHolder] = useState(
    isPreview ? state.bankInfo.accountHolder : "",
  );

  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupStatus, setLookupStatus] = useState<
    "idle" | "success" | "error" | "key_missing"
  >("idle");
  const [lookupMessage, setLookupMessage] = useState("");
  // Availability state
  const [availability, setAvailability] = useState<AvailabilityRow[]>([
    { id: "initial", day: "", from: "", to: "" },
  ]);
  const [availabilityAttempted, setAvailabilityAttempted] = useState(false);

  // Fetch VietQR banks list on mount
  useEffect(() => {
    let mounted = true;
    getVietQRBanks()
      .then((data) => {
        if (!mounted) return;
        setBanks(data);
        setIsLoadingBanks(false);

        // Pre-select bank if already saved
        if (isPreview && state.bankInfo.bankBin) {
          const found = data.find((b) => b.bin === state.bankInfo.bankBin);
          if (found) setSelectedBank(found);
        } else if (isPreview && state.bankInfo.bankName) {
          const found = data.find(
            (b) =>
              b.shortName.toLowerCase() ===
                state.bankInfo.bankName.toLowerCase() ||
              b.code.toLowerCase() === state.bankInfo.bankName.toLowerCase() ||
              b.name
                .toLowerCase()
                .includes(state.bankInfo.bankName.toLowerCase()),
          );
          if (found) setSelectedBank(found);
        }
      })
      .catch(() => {
        if (mounted) setIsLoadingBanks(false);
      });

    return () => {
      mounted = false;
    };
  }, [isPreview, state.bankInfo.bankBin, state.bankInfo.bankName]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced auto-lookup account name
  useEffect(() => {
    const cleanNum = accountNumber.trim();
    if (!selectedBank || cleanNum.length < 6) return;

    const timer = setTimeout(async () => {
      setIsLookingUp(true);
      setLookupStatus("idle");
      setLookupMessage("");

      const result = await lookupVietQRAccount(selectedBank.bin, cleanNum);
      setIsLookingUp(false);

      if (result.success && result.accountName) {
        setAccountHolder(result.accountName);
        setLookupStatus("success");
        setLookupMessage(result.accountName);
      } else if (result.isKeyMissing) {
        setLookupStatus("key_missing");
        setLookupMessage(
          "Chưa thể xác thực tự động qua VietQR. Vui lòng tự nhập và kiểm tra kỹ tên chủ tài khoản.",
        );
      } else {
        setLookupStatus("error");
        setLookupMessage(result.error || "Số tài khoản không hợp lệ");
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [accountNumber, selectedBank]);

  const handleManualLookup = async () => {
    if (!selectedBank || accountNumber.trim().length < 6) return;
    setIsLookingUp(true);
    const result = await lookupVietQRAccount(
      selectedBank.bin,
      accountNumber.trim(),
    );
    setIsLookingUp(false);

    if (result.success && result.accountName) {
      setAccountHolder(result.accountName);
      setLookupStatus("success");
      setLookupMessage(result.accountName);
    } else if (result.isKeyMissing) {
      setLookupStatus("key_missing");
      setLookupMessage(
        "Chưa thể xác thực tự động qua VietQR. Vui lòng tự nhập và kiểm tra kỹ tên chủ tài khoản.",
      );
    } else {
      setLookupStatus("error");
      setLookupMessage(result.error || "Số tài khoản không hợp lệ");
    }
  };

  const bankDetails = (): ReadinessBank | null => {
    if (
      !selectedBank ||
      accountNumber.trim().length < 6 ||
      !accountHolder.trim()
    )
      return null;
    return {
      bankName: selectedBank.name,
      accountNumber: accountNumber.trim(),
      accountName: accountHolder.trim(),
    };
  };

  const availabilityDetails = (): ReadinessAvailability[] =>
    availability.map(({ day, from, to }) => ({ day, from, to }));

  const updateAvailability = (
    id: string,
    field: keyof ReadinessAvailability,
    value: string,
  ) => {
    setAvailability((rows) =>
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const validateAvailability = (
    rows: ReadinessAvailability[],
  ): string | null => {
    if (rows.length === 0) return "Vui lòng thêm ít nhất một khung giờ rảnh.";
    for (const row of rows) {
      if (!row.day || !row.from || !row.to)
        return "Vui lòng chọn thứ, giờ bắt đầu và giờ kết thúc cho mọi khung giờ.";
      if (
        !AVAILABILITY_DAYS.some((day) => day.value === row.day) ||
        !TIME_PATTERN.test(row.from) ||
        !TIME_PATTERN.test(row.to)
      )
        return "Ngày hoặc giờ đã chọn không hợp lệ.";
      if (row.from >= row.to) return "Giờ kết thúc phải sau giờ bắt đầu.";
    }
    for (let index = 0; index < rows.length; index += 1) {
      for (let next = index + 1; next < rows.length; next += 1) {
        if (
          rows[index].day === rows[next].day &&
          rows[index].from < rows[next].to &&
          rows[next].from < rows[index].to
        ) {
          return "Các khung giờ trong cùng một ngày không được trùng nhau.";
        }
      }
    }
    return null;
  };

  const saveDetails = (section?: "bank" | "availability") => {
    const slots = availabilityDetails();
    if (isPreview) {
      if (section !== "bank") {
        const availabilityError = validateAvailability(slots);
        if (availabilityError) {
          setAvailabilityAttempted(true);
          toast.error(availabilityError, { position: "top-right" });
          return;
        }
        setAvailabilityAttempted(false);
      }
      dispatchAction(
        section === "bank"
          ? "save-bank-information"
          : section === "availability"
            ? "save-availability"
            : "complete-onboarding",
      );
      return;
    }
    if (!status) return;
    const bank = bankDetails();
    const bankRequired = !status.bankInformationCompleted || section === "bank";
    const availabilityRequired =
      !status.availabilityTimeCompleted || section === "availability";
    if (availabilityRequired) {
      const availabilityError = validateAvailability(slots);
      if (availabilityError) {
        setAvailabilityAttempted(true);
        toast.error(availabilityError, { position: "top-right" });
        return;
      }
      setAvailabilityAttempted(false);
    }
    if (bankRequired && !bank) {
      toast.error(
        "Vui lòng chọn ngân hàng, nhập số tài khoản và tên chủ tài khoản.",
        { position: "top-right" },
      );
      return;
    }
    const details: ReadinessDetails = {
      ...(bankRequired && bank ? { bank } : {}),
      ...(availabilityRequired ? { availability: slots } : {}),
    };
    save.mutate(details);
  };

  const completeSlots = availability.filter(
    (row) => row.day && row.from && row.to && row.from < row.to,
  ).length;

  const filteredBanks = banks.filter(
    (b) =>
      b.shortName.toLowerCase().includes(bankSearch.toLowerCase()) ||
      b.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
      b.code.toLowerCase().includes(bankSearch.toLowerCase()) ||
      b.bin.includes(bankSearch),
  );

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-primary/15 bg-primary/[0.035] p-5 sm:p-6">
        <h2 className="font-nunito mt-2 text-xl font-black text-foreground sm:text-2xl">
          Sẵn sàng nhận lớp cùng BeeWise
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Thêm tài khoản nhận thanh toán và thời gian có thể dạy.
        </p>
      </div>
      {!isPreview && readiness.isError && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          Chưa tải được trạng thái thông tin bổ sung.{" "}
          <button
            type="button"
            onClick={() => void readiness.refetch()}
            className="font-bold underline"
          >
            Thử lại
          </button>
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-5">
          {/* VietQR Bank Info Card */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-nunito mt-1 text-lg font-extrabold text-foreground">
                  Tài khoản nhận thanh toán
                </h3>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Chọn ngân hàng từ danh sách VietQR và kiểm tra chính xác tên chủ
              tài khoản trước khi lưu.
            </p>
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-400/40 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              <Warning className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                Vui lòng kiểm tra và nhập chính xác thông tin tài khoản ngân
                hàng thụ hưởng. Nếu thông tin không chính xác, quá trình thanh
                toán sẽ bị chậm trễ hoặc có thể không thực hiện được.
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {/* Bank selector dropdown */}
              <div className="relative" ref={dropdownRef}>
                <label className="mb-1.5 block text-xs font-bold text-foreground">
                  Ngân hàng thụ hưởng{" "}
                  <span className="text-destructive">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-card px-3 text-left text-sm transition hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {selectedBank ? (
                    <div className="flex items-center gap-2 overflow-hidden">
                      {selectedBank.logo ? (
                        <div className="relative h-5 w-8 shrink-0">
                          <Image
                            src={selectedBank.logo}
                            alt={selectedBank.shortName}
                            fill
                            sizes="32px"
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <Bank className="h-4 w-4 text-primary" />
                      )}
                      <span className="truncate font-semibold text-foreground">
                        {selectedBank.shortName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {isLoadingBanks
                        ? "Đang tải ngân hàng..."
                        : "Chọn ngân hàng"}
                    </span>
                  )}
                  <CaretDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                    {/* Search box inside dropdown */}
                    <div className="border-b border-border p-2">
                      <div className="relative flex items-center">
                        <MagnifyingGlass className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={bankSearch}
                          onChange={(e) => setBankSearch(e.target.value)}
                          placeholder="Tìm tên hoặc mã ngân hàng..."
                          className="h-8 w-full rounded-lg bg-muted pl-8 pr-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Bank list */}
                    <div className="max-h-56 overflow-y-auto p-1">
                      {filteredBanks.length === 0 ? (
                        <p className="p-3 text-center text-xs text-muted-foreground">
                          Không tìm thấy ngân hàng phù hợp
                        </p>
                      ) : (
                        filteredBanks.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => {
                              setSelectedBank(b);
                              setAccountHolder("");
                              setLookupStatus("idle");
                              setIsDropdownOpen(false);
                              setBankSearch("");
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition hover:bg-primary/10 ${
                              selectedBank?.id === b.id
                                ? "bg-primary/15 font-bold text-primary"
                                : "text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              {b.logo ? (
                                <div className="relative h-5 w-8 shrink-0">
                                  <Image
                                    src={b.logo}
                                    alt={b.shortName}
                                    fill
                                    sizes="32px"
                                    className="object-contain"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <Bank className="h-4 w-4 text-primary" />
                              )}
                              <div className="truncate">
                                <span className="font-bold">{b.shortName}</span>
                                <span className="ml-1.5 text-[11px] text-muted-foreground">
                                  {b.name}
                                </span>
                              </div>
                            </div>
                            {selectedBank?.id === b.id && (
                              <Check className="h-3.5 w-3.5 text-primary" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Account Number Input */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-foreground">
                  Số tài khoản <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    value={accountNumber}
                    onChange={(e) => {
                      setAccountNumber(e.target.value.replace(/\D/g, ""));
                      setAccountHolder("");
                      setLookupStatus("idle");
                    }}
                    placeholder="Nhập số tài khoản"
                    autoComplete="off"
                    inputMode="numeric"
                    className="h-10 rounded-xl border-input pr-9 font-google-sans text-sm focus:border-primary"
                  />
                  <div className="absolute right-2.5 top-2.5">
                    {isLookingUp ? (
                      <Spinner className="h-5 w-5 animate-spin text-primary" />
                    ) : lookupStatus === "success" ? (
                      <CheckCircle
                        className="h-5 w-5 text-secondary"
                        weight="fill"
                      />
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Account Holder Name */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-xs font-bold text-foreground">
                    Tên chủ tài khoản{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  {lookupStatus === "success" && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-secondary">
                      <CheckCircle className="h-3 w-3" weight="fill" />
                      Đã xác thực
                    </span>
                  )}
                </div>
                <Input
                  value={accountHolder}
                  onChange={(e) => {
                    setAccountHolder(e.target.value.toUpperCase());
                    setLookupStatus("idle");
                  }}
                  placeholder="NGUYEN VAN A"
                  autoComplete="name"
                  className={`h-10 rounded-xl border-input font-semibold uppercase tracking-wide focus:border-primary ${
                    lookupStatus === "success" ? "bg-secondary/10" : ""
                  }`}
                />
              </div>
            </div>

            {/* Lookup feedback message / validation status */}
            <div className="mt-3">
              {isLookingUp && (
                <p className="flex items-center gap-1.5 text-xs text-primary">
                  <Spinner className="h-3.5 w-3.5 animate-spin" />
                  Đang tra cứu tên chủ tài khoản từ ngân hàng...
                </p>
              )}

              {lookupStatus === "success" && (
                <p className="flex items-center gap-1.5 text-xs font-semibold text-secondary">
                  <CheckCircle className="h-4 w-4" weight="fill" />
                  Tài khoản hợp lệ: {lookupMessage}
                </p>
              )}

              {lookupStatus === "key_missing" && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-accent/20 p-2.5 text-xs text-amber-800 ring-1 ring-accent/40">
                  <span className="flex items-center gap-1.5">
                    <Warning className="h-4 w-4 shrink-0" />
                    {lookupMessage}
                  </span>
                  {isPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setAccountHolder("NGUYỄN VĂN AN");
                        setLookupStatus("success");
                        setLookupMessage("NGUYỄN VĂN AN (Mẫu)");
                      }}
                      className="rounded bg-card px-2 py-0.5 text-[11px] font-bold text-primary shadow-sm hover:bg-primary/10"
                    >
                      Điền mẫu (Preview)
                    </button>
                  )}
                </div>
              )}

              {lookupStatus === "error" && (
                <div className="flex items-center justify-between gap-2 text-xs text-destructive">
                  <span className="flex items-center gap-1.5">
                    <Warning className="h-4 w-4 shrink-0" />
                    {lookupMessage}
                  </span>
                  <button
                    type="button"
                    onClick={handleManualLookup}
                    className="font-semibold text-primary underline"
                  >
                    Thử lại
                  </button>
                </div>
              )}
            </div>

            {/* Save button */}
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs text-muted-foreground">
                {status?.bankInformationCompleted
                  ? "Thông tin đã lưu. Nhập lại nếu cần cập nhật."
                  : "Vui lòng kiểm tra kỹ tên chủ tài khoản trước khi lưu."}
              </span>
              {(isPreview ||
                (status?.bankInformationCompleted &&
                  status?.availabilityTimeCompleted)) && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={save.isPending || (!isPreview && !status)}
                  onClick={() => saveDetails("bank")}
                  className="rounded-full border-primary/30 text-primary hover:bg-primary/5"
                >
                  {status?.bankInformationCompleted
                    ? "Cập nhật ngân hàng"
                    : "Lưu ngân hàng"}
                </Button>
              )}
            </div>
          </div>

          {/* Flexible availability ranges */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                  Lịch rảnh có thể nhận lớp
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Chọn thứ và nhập giờ bắt đầu, giờ kết thúc cho từng khung giờ bạn có thể dạy.
                </p>
                {status?.availabilityTimeCompleted && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Lịch đã lưu. Nếu cập nhật, hãy nhập lại toàn bộ các khung giờ muốn giữ.
                  </p>
                )}
              </div>
              {completeSlots > 0 && (
                <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {completeSlots} khung giờ
                </span>
              )}
            </div>

            <div className="mt-5 space-y-3">
              {availability.length === 0 && (
                <p className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                  Chưa có khung giờ nào. Hãy thêm thời gian bạn có thể nhận lớp.
                </p>
              )}
              {availability.map((row, index) => (
                <div
                  key={row.id}
                  className="rounded-3xl border border-border bg-muted p-4 shadow-soft"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-foreground">
                      Khung giờ {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setAvailability((rows) =>
                          rows.filter((item) => item.id !== row.id),
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-destructive transition hover:bg-destructive/10"
                      aria-label={`Xóa khung giờ ${index + 1}`}
                    >
                      <Trash className="h-4 w-4" aria-hidden="true" /> Xóa
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr_1fr]">
                    <div className="grid min-w-0 gap-1.5 text-xs font-bold text-foreground">
                      <span>Thứ trong tuần</span>
                      <AvailabilityDaySelect
                        value={row.day}
                        onChange={(value) => updateAvailability(row.id, "day", value)}
                        label={`Thứ trong tuần, khung giờ ${index + 1}`}
                        invalid={availabilityAttempted && !row.day}
                        errorId={`availability-${row.id}-error`}
                      />
                    </div>
                    <div className="grid min-w-0 gap-1.5 text-xs font-bold text-foreground">
                      <span>Từ giờ</span>
                      <AvailabilityTimePicker
                        value={row.from}
                        onChange={(value) => updateAvailability(row.id, "from", value)}
                        label={`Giờ bắt đầu, khung giờ ${index + 1}`}
                        invalid={availabilityAttempted && !row.from}
                        errorId={`availability-${row.id}-error`}
                      />
                    </div>
                    <div className="grid min-w-0 gap-1.5 text-xs font-bold text-foreground">
                      <span>Đến giờ</span>
                      <AvailabilityTimePicker
                        value={row.to}
                        onChange={(value) => updateAvailability(row.id, "to", value)}
                        label={`Giờ kết thúc, khung giờ ${index + 1}`}
                        fallback="09:00"
                        invalid={availabilityAttempted && (!row.to || (Boolean(row.from) && row.from >= row.to))}
                        errorId={`availability-${row.id}-error`}
                      />
                    </div>
                  </div>
                  {availabilityAttempted && (!row.day || !row.from || !row.to || row.from >= row.to) && (
                    <p id={`availability-${row.id}-error`} role="alert" className="mt-2 text-xs font-semibold text-destructive">
                      {!row.day || !row.from || !row.to ? "Vui lòng chọn đủ thứ, giờ bắt đầu và giờ kết thúc." : "Giờ kết thúc cần sau giờ bắt đầu."}
                    </p>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setAvailability((rows) => [
                    ...rows,
                    { id: crypto.randomUUID(), day: "", from: "", to: "" },
                  ])
                }
                className="rounded-full border-primary/30 text-primary hover:bg-primary/5"
              >
                <Plus className="h-4 w-4" aria-hidden="true" /> Thêm khung giờ
              </Button>
            </div>

            <div className="mt-5 flex justify-end">
              {(isPreview ||
                (status?.bankInformationCompleted &&
                  status?.availabilityTimeCompleted)) && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={save.isPending || (!isPreview && !status)}
                  onClick={() => saveDetails("availability")}
                  className="rounded-full border-primary/30 text-primary hover:bg-primary/5"
                >
                  {status?.availabilityTimeCompleted
                    ? "Cập nhật lịch rảnh"
                    : "Lưu lịch rảnh"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">
              Lưu ý
            </p>
            <ul className="mt-3 grid gap-2">
              {[
                "Cần điền đầy đủ thông tin ngân hàng chính xác",
                "Chọn các khung giờ bạn có thể dạy trong tuần",
                "Bạn có thể cập nhật lại các thông tin này",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-foreground/80"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Button
            type="button"
            disabled={
              save.isPending ||
              (!isPreview &&
                (!status ||
                  (status.bankInformationCompleted &&
                    status.availabilityTimeCompleted)))
            }
            onClick={() => saveDetails()}
            className="rounded-full bg-primary py-3 text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {save.isPending
              ? "Đang lưu..."
              : status?.bankInformationCompleted &&
                  status?.availabilityTimeCompleted
                ? "Đã lưu thông tin"
                : "Lưu thông tin bổ sung"}
          </Button>
        </aside>
      </div>
    </section>
  );
}
