"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  MagnifyingGlass,
  PencilSimple,
  WarningCircle,
} from "@phosphor-icons/react";
import { MOMO_BANKS } from "../constants/momo-banks";
import {
  parseBankInformation,
  serializeBankInformation,
  type BankInformation,
} from "../utils/bank-information";
import { profileInputClass } from "./ProfileField";

export function BankInformationField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const information = parseBankInformation(value);
  const [search, setSearch] = useState("");
  const [isChangingBank, setIsChangingBank] = useState(false);
  const showBankPicker = !information.bankCode || isChangingBank;
  const banks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    if (!query) return MOMO_BANKS;
    return MOMO_BANKS.filter(
      (bank) =>
        bank.name.toLocaleLowerCase("vi").includes(query) ||
        bank.code.toLocaleLowerCase("vi").includes(query) ||
        bank.napasCode.includes(query),
    );
  }, [search]);

  const update = (next: Partial<BankInformation>) => {
    onChange(serializeBankInformation({ ...information, ...next }));
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div
        className={`grid items-start gap-4 ${showBankPicker ? "lg:grid-cols-[1.15fr_0.85fr]" : ""}`}
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            {showBankPicker ? "Chọn ngân hàng" : "Ngân hàng nhận thanh toán"}
          </label>
          {showBankPicker ? (
            <>
              <div className="relative">
                <MagnifyingGlass
                  className="absolute left-3 top-3.5 h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className={`${profileInputClass} pl-9`}
                  placeholder="Tìm tên, mã ngân hàng hoặc mã Napas..."
                />
              </div>
              <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1">
                {banks.map((bank) => (
                  <button
                    key={bank.code}
                    type="button"
                    onClick={() => {
                      update({
                        bankCode: bank.code,
                        bankName: bank.name,
                        napasCode: bank.napasCode,
                        bankLogoUrl: bank.logoUrl,
                      });
                      setSearch("");
                      setIsChangingBank(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${information.bankCode === bank.code ? "bg-[#280f91]/10 text-[#280f91]" : "hover:bg-slate-50"}`}
                  >
                    <span className="relative h-8 w-12 shrink-0 overflow-hidden rounded-md bg-white">
                      <Image
                        src={bank.logoUrl}
                        alt={`Logo ${bank.name}`}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </span>
                    <span className="min-w-0">
                      <strong className="block truncate text-sm">
                        {bank.name}
                      </strong>
                      <span className="text-xs text-slate-500">
                        {bank.code}
                        {bank.napasCode ? ` · ${bank.napasCode}` : ""}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex min-h-20 items-center justify-between gap-3 rounded-xl border border-[#280f91]/15 bg-[#280f91]/5 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative h-12 w-20 shrink-0 rounded-lg bg-white">
                  <Image
                    src={information.bankLogoUrl}
                    alt={`Logo ${information.bankName}`}
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-900">
                    {information.bankName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {information.bankCode}
                    {information.napasCode
                      ? ` · Napas ${information.napasCode}`
                      : ""}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangingBank(true)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#280f91] transition hover:bg-white"
              >
                <PencilSimple className="h-4 w-4" /> Thay đổi
              </button>
            </div>
          )}
        </div>
        {showBankPicker ? (
          <BankAccountFields information={information} update={update} />
        ) : null}
      </div>
      {!showBankPicker ? (
        <BankAccountFields
          information={information}
          update={update}
          horizontal
        />
      ) : null}
      <div className="flex gap-2 rounded-xl border border-[#ffc500]/50 bg-[#fff3cb] p-3 text-sm leading-6 text-[#714b0b]">
        <WarningCircle
          className="mt-0.5 h-5 w-5 shrink-0"
          weight="fill"
          aria-hidden="true"
        />
        <p>
          Hãy nhập và kiểm tra chính xác ngân hàng, số tài khoản và tên chủ tài
          khoản. Thông tin sai có thể khiến khoản thanh toán bị chậm hoặc chuyển
          không thành công.
        </p>
      </div>
    </div>
  );
}

function BankAccountFields({
  information,
  update,
  horizontal = false,
}: {
  information: BankInformation;
  update: (next: Partial<BankInformation>) => void;
  horizontal?: boolean;
}) {
  return (
    <div
      className={`grid items-start gap-4 ${horizontal ? "sm:grid-cols-2" : ""}`}
    >
      <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
        Số tài khoản
        <input
          value={information.accountNumber}
          onChange={(event) =>
            update({ accountNumber: event.target.value.replace(/\D/g, "") })
          }
          inputMode="numeric"
          autoComplete="off"
          className={`${profileInputClass} font-google-sans`}
          placeholder="Nhập số tài khoản"
        />
      </label>
      <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
        Tên chủ tài khoản
        <input
          value={information.accountHolder}
          onChange={(event) =>
            update({ accountHolder: event.target.value.toUpperCase() })
          }
          autoComplete="name"
          className={`${profileInputClass} uppercase`}
          placeholder="NGUYEN VAN A"
        />
      </label>
    </div>
  );
}
