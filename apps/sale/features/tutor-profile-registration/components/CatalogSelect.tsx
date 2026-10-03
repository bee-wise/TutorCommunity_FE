"use client";

import { useDeferredValue, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CaretDown, Check, MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { Popover } from "radix-ui";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { tutorProfileRegistrationService } from "../services/profile-registration.service";
import type { CatalogResource } from "../types/profile-registration.types";
import {
  profileSelectContentClass,
  profileSelectOptionClass,
  profileSelectTriggerClass,
} from "./ProfileSelect";

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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const deferredSearch = useDeferredValue(search.trim());
  const queryClient = useQueryClient();
  const queryKey = ["catalog", resource, deferredSearch] as const;
  const catalogQuery = useQuery({
    queryKey,
    queryFn: () =>
      tutorProfileRegistrationService.listCatalog(resource, deferredSearch),
    staleTime: 5 * 60 * 1000,
  });
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const selectedId = !multiple ? selected[0] : undefined;
  const selectedItemQuery = useQuery({
    queryKey: ["catalog", resource, "item", selectedId],
    queryFn: () =>
      tutorProfileRegistrationService.getCatalogItem(
        resource,
        selectedId ?? "",
      ),
    enabled: Boolean(selectedId) && !multiple,
    staleTime: 5 * 60 * 1000,
  });
  const items = catalogQuery.data ?? [];
  const selectedItem =
    items.find((item) => item.id === selectedId) ?? selectedItemQuery.data;
  const hasExactMatch = items.some(
    (item) =>
      item.name.toLocaleLowerCase("vi") ===
      search.trim().toLocaleLowerCase("vi"),
  );
  const proposalMutation = useMutation({
    mutationFn: (name: string) =>
      tutorProfileRegistrationService.proposeCatalog(resource, name),
    onSuccess: (item, name) => {
      queryClient.setQueryData(
        ["catalog", resource, name],
        (current: typeof items | undefined) => [...(current ?? []), item],
      );
      onChange(multiple ? [...selected, item.id] : item.id);
      setSearch("");
      if (!multiple) setOpen(false);
    },
  });

  const choose = (id: string) => {
    if (multiple) {
      onChange(
        selected.includes(id)
          ? selected.filter((item) => item !== id)
          : [...selected, id],
      );
      return;
    }
    onChange(id);
    setOpen(false);
    setSearch("");
  };

  const display = multiple
    ? selected.length
      ? `Đã chọn ${selected.length} chuyên môn`
      : placeholder
    : (selectedItem?.name ??
      (selectedId
        ? selectedItemQuery.isPending
          ? "Đang tải lựa chọn..."
          : "Đã chọn"
        : placeholder));

  const focusOption = (index: number) => {
    optionRefs.current[index]?.focus();
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setSearch("");
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={placeholder}
          className={profileSelectTriggerClass}
        >
          <span
            className={`min-w-0 truncate ${selected.length ? "" : "text-muted-foreground"}`}
          >
            {display}
          </span>
          <CaretDown
            size={16}
            aria-hidden="true"
            className={`shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </Popover.Trigger>
      {selectedItem && !selectedItem.isApproved && !multiple ? (
        <p className="mt-1 text-xs font-medium text-amber-800">
          Đang chờ BeeWise duyệt
        </p>
      ) : null}
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          collisionPadding={12}
          className={profileSelectContentClass}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            searchRef.current?.focus();
          }}
        >
          <div className="relative mb-1.5">
            <MagnifyingGlass
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              ref={searchRef}
              type="search"
              aria-label={placeholder}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" && items.length) {
                  event.preventDefault();
                  focusOption(0);
                }
              }}
              placeholder={placeholder}
              className="h-10 w-full rounded-xl border border-border bg-muted/50 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <div
            role="listbox"
            aria-label={placeholder}
            aria-multiselectable={multiple || undefined}
            className="max-h-56 overflow-y-auto overscroll-contain"
          >
            {catalogQuery.isLoading ? (
              <div className="space-y-2 p-2" aria-label="Đang tải danh mục">
                <div className="h-9 animate-pulse rounded-xl bg-muted" />
                <div className="h-9 animate-pulse rounded-xl bg-muted" />
              </div>
            ) : catalogQuery.isError ? (
              <p className="p-3 text-sm text-destructive">
                Không tải được danh mục. Vui lòng thử lại.
              </p>
            ) : items.length ? (
              items.map((item, index) => {
                const isSelected = selected.includes(item.id);
                return (
                  <button
                    key={item.id}
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => choose(item.id)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "ArrowDown" &&
                        index < items.length - 1
                      ) {
                        event.preventDefault();
                        focusOption(index + 1);
                      } else if (event.key === "ArrowUp") {
                        event.preventDefault();
                        if (index === 0) searchRef.current?.focus();
                        else focusOption(index - 1);
                      } else if (event.key === "Home") {
                        event.preventDefault();
                        focusOption(0);
                      } else if (event.key === "End") {
                        event.preventDefault();
                        focusOption(items.length - 1);
                      }
                    }}
                    className={`${profileSelectOptionClass} ${isSelected ? "bg-primary/10 font-semibold text-primary" : "text-foreground"}`}
                  >
                    <span className="min-w-0 flex-1">{item.name}</span>
                    {!item.isApproved ? (
                      <span className="text-[10px] text-amber-800">
                        Chờ duyệt
                      </span>
                    ) : null}
                    {isSelected ? (
                      <Check
                        size={16}
                        weight="bold"
                        aria-hidden="true"
                        className="shrink-0 text-primary"
                      />
                    ) : null}
                  </button>
                );
              })
            ) : (
              <p className="p-3 text-sm text-muted-foreground">
                Không tìm thấy kết quả phù hợp.
              </p>
            )}
          </div>
          {search.trim().length >= 2 && !hasExactMatch ? (
            <button
              type="button"
              disabled={proposalMutation.isPending}
              onClick={() => proposalMutation.mutate(search.trim())}
              className={`${profileSelectOptionClass} mt-1 border-t border-border font-semibold text-primary disabled:opacity-50`}
            >
              <Plus size={16} aria-hidden="true" />
              {proposalMutation.isPending
                ? "Đang đề xuất..."
                : `Đề xuất “${search.trim()}”`}
            </button>
          ) : null}
          {proposalMutation.isError ? (
            <p className="px-2 pt-1 text-xs text-destructive">
              {getApiErrorMessage(proposalMutation.error)}
            </p>
          ) : null}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
