"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Bank,
  CaretDown,
  Check,
  CheckCircle,
  MagnifyingGlass,
  Sparkle,
  Spinner,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@workspace/ui/components/ui/button";
import { Input } from "@workspace/ui/components/ui/input";
import { useTutorOnboardingViewModel } from "../TutorOnboardingProvider";
import {
  getVietQRBanks,
  lookupVietQRAccount,
  type VietQRBank,
} from "../../api/vietqr.api";
import type {
  AvailabilityDay,
  AvailabilityTimeSlot,
  WeeklyAvailability,
} from "../../types";

const DAYS: { id: AvailabilityDay; label: string; short: string }[] = [
  { id: "mon", label: "Thứ Hai", short: "T2" },
  { id: "tue", label: "Thứ Ba", short: "T3" },
  { id: "wed", label: "Thứ Tư", short: "T4" },
  { id: "thu", label: "Thứ Năm", short: "T5" },
  { id: "fri", label: "Thứ Sáu", short: "T6" },
  { id: "sat", label: "Thứ Bảy", short: "T7" },
  { id: "sun", label: "Chủ Nhật", short: "CN" },
];

const SLOTS: { id: AvailabilityTimeSlot; label: string; time: string }[] = [
  { id: "morning", label: "Buổi sáng", time: "07:00 – 12:00" },
  { id: "afternoon", label: "Buổi chiều", time: "12:00 – 18:00" },
  { id: "evening", label: "Buổi tối", time: "18:00 – 22:00" },
];

export function PostApprovalScreen() {
  const { state, dispatchAction } = useTutorOnboardingViewModel();

  // Bank form state
  const [banks, setBanks] = useState<VietQRBank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);
  const [selectedBank, setSelectedBank] = useState<VietQRBank | null>(null);
  const [bankSearch, setBankSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [accountNumber, setAccountNumber] = useState(
    state.bankInfo.accountNumber || "",
  );
  const [accountHolder, setAccountHolder] = useState(
    state.bankInfo.accountHolder || "",
  );

  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupStatus, setLookupStatus] = useState<
    "idle" | "success" | "error" | "key_missing"
  >("idle");
  const [lookupMessage, setLookupMessage] = useState("");
  const [isBankSaved, setIsBankSaved] = useState(false);

  // Availability state
  const [availability, setAvailability] = useState<WeeklyAvailability>(
    state.weeklyAvailability,
  );
  const [isSaving, setIsSaving] = useState(false);

  // Fetch VietQR banks list on mount
  useEffect(() => {
    let mounted = true;
    getVietQRBanks()
      .then((data) => {
        if (!mounted) return;
        setBanks(data);
        setIsLoadingBanks(false);

        // Pre-select bank if already saved
        if (state.bankInfo.bankBin) {
          const found = data.find((b) => b.bin === state.bankInfo.bankBin);
          if (found) setSelectedBank(found);
        } else if (state.bankInfo.bankName) {
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
  }, [state.bankInfo.bankBin, state.bankInfo.bankName]);

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
    if (!selectedBank || cleanNum.length < 6) {
      if (cleanNum.length === 0) {
        setLookupStatus("idle");
        setLookupMessage("");
      }
      return;
    }

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
          "API VietQR cần Client Key/API Key để tra cứu thực tế. Bạn có thể tự nhập tên hoặc nhấn 'Điền mẫu'.",
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
        "API VietQR cần Client Key/API Key. Bạn có thể nhập trực tiếp tên chủ tài khoản bên dưới.",
      );
    } else {
      setLookupStatus("error");
      setLookupMessage(result.error || "Số tài khoản không hợp lệ");
    }
  };

  const handleSaveBank = () => {
    dispatchAction("save-bank-information");
    setIsBankSaved(true);
    setTimeout(() => setIsBankSaved(false), 3000);
  };

  const toggleSlot = (day: AvailabilityDay, slot: AvailabilityTimeSlot) => {
    setAvailability((prev) => {
      const current = prev[day] ?? [];
      const next = current.includes(slot)
        ? current.filter((s) => s !== slot)
        : [...current, slot];
      return { ...prev, [day]: next };
    });
  };

  const isSelected = (day: AvailabilityDay, slot: AvailabilityTimeSlot) =>
    (availability[day] ?? []).includes(slot);

  const totalSlots = Object.values(availability).reduce(
    (sum, slots) => sum + (slots?.length ?? 0),
    0,
  );

  const handleComplete = () => {
    setIsSaving(true);
    setTimeout(() => {
      dispatchAction("complete-onboarding");
      setIsSaving(false);
    }, 600);
  };

  const filteredBanks = banks.filter(
    (b) =>
      b.shortName.toLowerCase().includes(bankSearch.toLowerCase()) ||
      b.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
      b.code.toLowerCase().includes(bankSearch.toLowerCase()) ||
      b.bin.includes(bankSearch),
  );

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-5">
        {/* VietQR Bank Info Card */}
        <div className="rounded-2xl border border-[#cfe1fa] bg-white p-6 shadow-[0_14px_34px_rgba(40,15,145,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#280f91]">
                Tài khoản ngân hàng nhận thanh toán
              </p>
              <h3 className="mt-1 text-base font-bold text-[#0c0c0b]">
                Xác thực số tài khoản tự động qua VietQR
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#280f91]/10 px-3 py-1 text-xs font-semibold text-[#280f91]">
              <Sparkle className="h-3.5 w-3.5" />
              VietQR API
            </span>
          </div>
          <p className="mt-2 text-sm text-[#5e6688]">
            Thông tin này được BeeWise dùng để chi trả học phí cho gia sư. Tên
            chủ tài khoản sẽ được tự động tra cứu từ ngân hàng để tránh sai sót.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {/* Bank selector dropdown */}
            <div className="relative" ref={dropdownRef}>
              <label className="mb-1.5 block text-xs font-bold text-[#3f3b55]">
                Ngân hàng thụ hưởng <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex h-10 w-full items-center justify-between rounded-xl border border-[#cfe1fa] bg-white px-3 text-left text-sm transition hover:border-[#280f91] focus:border-[#280f91] focus:outline-none focus:ring-2 focus:ring-[#280f91]/20"
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
                      <Bank className="h-4 w-4 text-[#280f91]" />
                    )}
                    <span className="truncate font-semibold text-[#0c0c0b]">
                      {selectedBank.shortName}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-[#5e6688]">
                    {isLoadingBanks
                      ? "Đang tải ngân hàng..."
                      : "Chọn ngân hàng"}
                  </span>
                )}
                <CaretDown
                  className={`h-4 w-4 text-[#5e6688] transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-hidden rounded-xl border border-[#cfe1fa] bg-white shadow-xl">
                  {/* Search box inside dropdown */}
                  <div className="border-b border-[#cfe1fa] p-2">
                    <div className="relative flex items-center">
                      <MagnifyingGlass className="absolute left-2.5 h-4 w-4 text-[#5e6688]" />
                      <input
                        type="text"
                        value={bankSearch}
                        onChange={(e) => setBankSearch(e.target.value)}
                        placeholder="Tìm tên hoặc mã ngân hàng..."
                        className="h-8 w-full rounded-lg bg-[#cfe1fa]/20 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#280f91]"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Bank list */}
                  <div className="max-h-56 overflow-y-auto p-1">
                    {filteredBanks.length === 0 ? (
                      <p className="p-3 text-center text-xs text-[#5e6688]">
                        Không tìm thấy ngân hàng phù hợp
                      </p>
                    ) : (
                      filteredBanks.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            setSelectedBank(b);
                            setIsDropdownOpen(false);
                            setBankSearch("");
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition hover:bg-[#280f91]/10 ${
                            selectedBank?.id === b.id
                              ? "bg-[#280f91]/15 font-bold text-[#280f91]"
                              : "text-[#0c0c0b]"
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
                              <Bank className="h-4 w-4 text-[#280f91]" />
                            )}
                            <div className="truncate">
                              <span className="font-bold">{b.shortName}</span>
                              <span className="ml-1.5 text-[11px] text-[#5e6688]">
                                {b.name}
                              </span>
                            </div>
                          </div>
                          {selectedBank?.id === b.id && (
                            <Check className="h-3.5 w-3.5 text-[#280f91]" />
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
              <label className="mb-1.5 block text-xs font-bold text-[#3f3b55]">
                Số tài khoản <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  value={accountNumber}
                  onChange={(e) =>
                    setAccountNumber(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Nhập số tài khoản"
                  autoComplete="off"
                  inputMode="numeric"
                  className="h-10 rounded-xl border-[#cfe1fa] pr-9 font-google-sans text-sm focus:border-[#280f91]"
                />
                <div className="absolute right-2.5 top-2.5">
                  {isLookingUp ? (
                    <Spinner className="h-5 w-5 animate-spin text-[#280f91]" />
                  ) : lookupStatus === "success" ? (
                    <CheckCircle
                      className="h-5 w-5 text-[#447353]"
                      weight="fill"
                    />
                  ) : null}
                </div>
              </div>
            </div>

            {/* Account Holder Name */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-bold text-[#3f3b55]">
                  Tên chủ tài khoản <span className="text-red-500">*</span>
                </label>
                {lookupStatus === "success" && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#447353]">
                    <CheckCircle className="h-3 w-3" weight="fill" />
                    Đã xác thực
                  </span>
                )}
              </div>
              <Input
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
                placeholder="NGUYEN VAN A"
                autoComplete="name"
                className={`h-10 rounded-xl border-[#cfe1fa] font-semibold uppercase tracking-wide focus:border-[#280f91] ${
                  lookupStatus === "success" ? "bg-[#447353]/5" : ""
                }`}
              />
            </div>
          </div>

          {/* Lookup feedback message / validation status */}
          <div className="mt-3">
            {isLookingUp && (
              <p className="flex items-center gap-1.5 text-xs text-[#280f91]">
                <Spinner className="h-3.5 w-3.5 animate-spin" />
                Đang tra cứu tên chủ tài khoản từ ngân hàng...
              </p>
            )}

            {lookupStatus === "success" && (
              <p className="flex items-center gap-1.5 text-xs font-semibold text-[#447353]">
                <CheckCircle className="h-4 w-4" weight="fill" />
                Tài khoản hợp lệ: {lookupMessage}
              </p>
            )}

            {lookupStatus === "key_missing" && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#fff3cb] p-2.5 text-xs text-[#905b0f] ring-1 ring-[#ffc510]/40">
                <span className="flex items-center gap-1.5">
                  <Warning className="h-4 w-4 shrink-0" />
                  {lookupMessage}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAccountHolder("NGUYỄN VĂN AN");
                    setLookupStatus("success");
                    setLookupMessage("NGUYỄN VĂN AN (Mẫu)");
                  }}
                  className="rounded bg-white px-2 py-0.5 text-[11px] font-bold text-[#280f91] shadow-sm hover:bg-[#280f91]/10"
                >
                  Điền mẫu (Preview)
                </button>
              </div>
            )}

            {lookupStatus === "error" && (
              <div className="flex items-center justify-between gap-2 text-xs text-red-600">
                <span className="flex items-center gap-1.5">
                  <Warning className="h-4 w-4 shrink-0" />
                  {lookupMessage}
                </span>
                <button
                  type="button"
                  onClick={handleManualLookup}
                  className="font-semibold text-[#280f91] underline"
                >
                  Thử lại
                </button>
              </div>
            )}
          </div>

          {/* Save button */}
          <div className="mt-5 flex items-center justify-between border-t border-[#cfe1fa]/60 pt-4">
            <span className="text-xs text-[#5e6688]">
              {isBankSaved ? (
                <span className="font-bold text-[#447353]">
                  ✓ Đã lưu thông tin tài khoản thành công!
                </span>
              ) : (
                "Vui lòng kiểm tra kỹ tên chủ tài khoản trước khi lưu."
              )}
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveBank}
              className="rounded-full border-[#280f91]/30 text-[#280f91] hover:bg-[#280f91]/5"
            >
              Lưu thông tin ngân hàng
            </Button>
          </div>
        </div>

        {/* Weekly availability grid */}
        <div className="rounded-2xl border border-[#cfe1fa] bg-white p-6 shadow-[0_14px_34px_rgba(40,15,145,0.08)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#280f91]">
                Lịch rảnh có thể nhận lớp
              </p>
              <p className="mt-1 text-sm text-[#5e6688]">
                Chọn các khung giờ bạn có thể dạy. Học viên sẽ đặt lịch trong
                những khung này.
              </p>
            </div>
            {totalSlots > 0 && (
              <span className="shrink-0 rounded-full bg-[#280f91]/10 px-3 py-1 text-xs font-bold text-[#280f91]">
                {totalSlots} khung đã chọn
              </span>
            )}
          </div>

          {/* Grid: days × slots */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[480px] border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="w-24 text-left" />
                  {SLOTS.map((slot) => (
                    <th
                      key={slot.id}
                      className="text-center text-xs font-semibold text-[#5e6688]"
                    >
                      <div>{slot.label}</div>
                      <div className="text-[10px] font-normal">{slot.time}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => (
                  <tr key={day.id}>
                    <td className="py-1 pr-2 text-sm font-semibold text-[#3f3b55]">
                      <span className="hidden sm:inline">{day.label}</span>
                      <span className="sm:hidden">{day.short}</span>
                    </td>
                    {SLOTS.map((slot) => {
                      const active = isSelected(day.id, slot.id);
                      return (
                        <td key={slot.id} className="text-center">
                          <button
                            type="button"
                            onClick={() => toggleSlot(day.id, slot.id)}
                            aria-pressed={active}
                            aria-label={`${day.label} – ${slot.label}`}
                            className={`h-9 w-full rounded-lg border-2 text-xs font-semibold transition ${
                              active
                                ? "border-[#280f91] bg-[#280f91] text-white shadow-sm"
                                : "border-[#cfe1fa] bg-[#cfe1fa]/30 text-[#5e6688] hover:border-[#280f91]/40 hover:bg-[#280f91]/10 hover:text-[#280f91]"
                            }`}
                          >
                            {active ? "✓" : "+"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => dispatchAction("save-availability")}
              className="rounded-full border-[#280f91]/30 text-[#280f91] hover:bg-[#280f91]/5"
            >
              Lưu lịch rảnh
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="flex flex-col gap-4">
        <div className="rounded-2xl border border-[#cfe1fa] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-[#280f91]">
            Lưu ý
          </p>
          <ul className="mt-3 grid gap-2">
            {[
              "Cần điền đầy đủ thông tin ngân hàng chính xác",
              "Tên chủ tài khoản tự động đồng bộ theo chuẩn VietQR",
              "Chọn ít nhất 3 khung giờ để tăng cơ hội nhận lớp",
              "Lịch rảnh có thể cập nhật sau khi vào LMS",
              "Tutor LMS chỉ mở sau khi hoàn tất bước này",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-[#3f3b55]"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffc510]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Button
          type="button"
          disabled={isSaving}
          onClick={handleComplete}
          className="rounded-full bg-[#280f91] py-3 text-white hover:bg-[#1f0b70] disabled:opacity-60"
        >
          {isSaving ? "Đang xử lý..." : "Hoàn tất onboarding"}
        </Button>
      </aside>
    </section>
  );
}
