"use client";

import { useDeferredValue, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, MagnifyingGlass, PencilSimple, Plus } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { tutorProfileRegistrationService } from "../services/profile-registration.service";
import type { CatalogResource } from "../types/profile-registration.types";
import { profileInputClass } from "./ProfileField";

export function CatalogSelect({
  resource,
  value,
  onChange,
  multiple = false,
  placeholder,
}: {
  resource: CatalogResource;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  placeholder: string;
}) {
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const deferredSearch = useDeferredValue(search.trim());
  const queryClient = useQueryClient();
  const queryKey = ["catalog", resource, deferredSearch] as const;
  const catalogQuery = useQuery({
    queryKey,
    queryFn: () => tutorProfileRegistrationService.listCatalog(resource, deferredSearch),
    staleTime: 5 * 60 * 1000,
  });
  const proposalMutation = useMutation({
    mutationFn: () => tutorProfileRegistrationService.proposeCatalog(resource, search),
    onSuccess: (item) => {
      queryClient.setQueryData(queryKey, [...(catalogQuery.data ?? []), item]);
      onChange(multiple ? [...(Array.isArray(value) ? value : []), item.id] : item.id);
      if (!multiple) {
        setIsEditing(false);
        setSearch("");
      }
    },
  });

  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const items = catalogQuery.data ?? [];
  const selectedId = !multiple ? selected[0] : undefined;
  const selectedItemQuery = useQuery({
    queryKey: ["catalog", resource, "item", selectedId],
    queryFn: () => tutorProfileRegistrationService.getCatalogItem(resource, selectedId ?? ""),
    enabled: Boolean(selectedId) && !multiple,
    staleTime: 5 * 60 * 1000,
  });
  const selectedItem =
    items.find((item) => item.id === selectedId) ?? selectedItemQuery.data;
  const showPicker = multiple || !selectedId || isEditing;
  const hasExactMatch = items.some((item) => item.name.toLocaleLowerCase("vi") === search.trim().toLocaleLowerCase("vi"));

  const toggle = (id: string) => {
    if (!multiple) {
      onChange(id);
      setIsEditing(false);
      setSearch("");
      return;
    }
    onChange(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  };

  return (
    <div className="h-fit self-start rounded-xl border border-slate-200 bg-white p-2">
      {!showPicker ? (
        <div className="flex min-h-11 items-center justify-between gap-3 rounded-lg bg-[#280f91]/5 px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#280f91]">
              {selectedItem?.name ?? (selectedItemQuery.isLoading ? "Đang tải lựa chọn..." : "Đã chọn")}
            </p>
            {selectedItem && !selectedItem.isApproved ? <p className="text-xs text-[#905b0f]">Đang chờ BeeWise duyệt</p> : null}
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="shrink-0 text-[#280f91]">
            <PencilSimple /> Thay đổi
          </Button>
        </div>
      ) : (
        <>
      <div className="relative">
        <MagnifyingGlass className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" aria-hidden="true" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={placeholder}
          className={`${profileInputClass} pl-9`}
        />
      </div>
      <div className="mt-2 max-h-44 overflow-y-auto rounded-lg bg-slate-50 p-1">
        {catalogQuery.isLoading ? (
          <div className="space-y-2 p-2" aria-label="Đang tải danh mục">
            <div className="h-8 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-8 animate-pulse rounded-lg bg-slate-200" />
          </div>
        ) : catalogQuery.isError ? (
          <p className="p-3 text-xs text-red-600">Không tải được danh mục. Vui lòng thử lại.</p>
        ) : items.length ? (
          items.map((item) => {
            const isSelected = selected.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                aria-pressed={multiple ? isSelected : undefined}
                className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition ${multiple ? `gap-2.5 ${isSelected ? "font-semibold text-[#280f91]" : "text-slate-700"} hover:bg-white` : isSelected ? "bg-[#280f91] font-semibold text-white" : "text-slate-700 hover:bg-white"}`}
              >
                {multiple ? (
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${isSelected ? "border-[#280f91] bg-[#280f91] text-white" : "border-slate-300 bg-white"}`} aria-hidden="true">
                    {isSelected ? <Check className="h-3 w-3" weight="bold" /> : null}
                  </span>
                ) : null}
                <span className="min-w-0 flex-1">{item.name}</span>
                {!item.isApproved ? <span className="ml-auto text-[10px] opacity-75">Chờ duyệt</span> : null}
              </button>
            );
          })
        ) : (
          <p className="p-3 text-xs text-slate-500">Không tìm thấy kết quả phù hợp.</p>
        )}
      </div>
      {search.trim().length >= 2 && !hasExactMatch ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={proposalMutation.isPending}
          onClick={() => proposalMutation.mutate()}
          className="mt-1 w-full justify-start text-[#280f91]"
        >
          <Plus /> {proposalMutation.isPending ? "Đang đề xuất..." : `Đề xuất “${search.trim()}”`}
        </Button>
      ) : null}
      {proposalMutation.isError ? (
        <p className="px-2 pt-1 text-xs text-red-600">{getApiErrorMessage(proposalMutation.error)}</p>
      ) : null}
        </>
      )}
    </div>
  );
}
