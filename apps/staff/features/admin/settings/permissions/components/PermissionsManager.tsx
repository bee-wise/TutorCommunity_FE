"use client";

import { useState } from "react";
import {
  ArrowClockwise as RotateCw,
  CaretLeft as ChevronLeft,
  CaretRight as ChevronRight,
  MagnifyingGlass as Search,
  Plus,
  ShieldCheck,
} from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import { Input } from "@workspace/ui/components/ui/input";
import { usePermissions } from "../hooks/usePermissions";
import { PermissionFormDialog } from "./PermissionFormDialog";
import { PermissionRow } from "./PermissionRow";
import type { Permission } from "../schemas/permission.schema";

const selectClassName =
  "h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/15";

export function PermissionsManager() {
  const state = usePermissions();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Permission | null>(null);
  const [deleting, setDeleting] = useState<Permission | null>(null);
  const roles = state.meta.data?.roleOptions ?? [];
  const modules = state.meta.data?.modules ?? [];
  const currentRole = roles.find((role) => role.id === state.currentRoleId);
  const rows =
    state.listing.data?.roles?.find((role) => role.id === state.currentRoleId)
      ?.permissions ?? [];
  const total = state.listing.data?.pagination.total ?? 0;
  const first = total ? state.page * state.pageSize + 1 : 0;
  const last = Math.min((state.page + 1) * state.pageSize, total);
  const hasError =
    state.meta.isError || state.listing.isError || state.assigned.isError;
  const isLoading = state.meta.isPending || state.listing.isPending;

  const openForm = (permission: Permission | null) => {
    setEditing(permission);
    setFormOpen(true);
  };

  return (
    <section
      aria-labelledby="permissions-heading"
      className="min-w-0 space-y-6"
    >
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h1
            id="permissions-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Phân quyền hệ thống
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Thiết lập quyền truy cập theo vai trò. Các quyền được gán và thao
            tác cho phép được quản lý tại đây.
          </p>
        </div>
        <Button
          onClick={() => openForm(null)}
          className="h-10 rounded-xl bg-primary px-4 text-primary-foreground shadow-md shadow-primary/15 hover:bg-primary/90"
        >
          <Plus className="size-4" /> Tạo quyền
        </Button>
      </header>

      <div className="overflow-hidden rounded-[22px] border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-gradient-to-r from-muted/70 to-card px-5 py-5 lg:px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Ma trận phân quyền
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Chọn vai trò để xem và cập nhật quyền được gán.
              </p>
            </div>
            <label className="min-w-48 space-y-1 text-xs font-semibold text-muted-foreground">
              Vai trò đang xem
              <select
                value={state.currentRoleId}
                onChange={(event) => state.changeRole(event.target.value)}
                className={selectClassName}
                disabled={!roles.length || state.savingAssignments}
              >
                {!roles.length && <option value="">Chưa có vai trò</option>}
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name || role.id}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {currentRole?.description && (
            <p className="mt-4 rounded-xl border border-primary/10 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
              {currentRole.description}
            </p>
          )}
        </div>

        <div className="grid gap-3 border-b border-border px-5 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] lg:px-6">
          <label className="space-y-1.5 text-xs font-semibold text-muted-foreground">
            Module
            <select
              value={state.moduleId}
              onChange={(event) => state.setModuleId(event.target.value)}
              className={selectClassName}
            >
              <option value="">Tất cả module</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.name || module.id}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-muted-foreground">
            Tìm quyền
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-3 size-4" />
              <Input
                value={state.searchInput}
                onChange={(event) => state.setSearchInput(event.target.value)}
                placeholder="Tìm theo tên quyền..."
                className="h-10 rounded-xl pl-9"
              />
            </span>
          </label>
          <div className="flex items-end">
            <Button
              variant="outline"
              size="icon"
              aria-label="Tải lại danh sách"
              title="Tải lại danh sách"
              onClick={() => void state.reload()}
              className="size-10 rounded-xl"
            >
              <RotateCw className="size-4" />
            </Button>
          </div>
        </div>

        {hasError ? (
          <div className="px-5 py-14 text-center">
            <p className="font-semibold text-destructive">
              Không thể tải dữ liệu phân quyền.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Vui lòng kiểm tra kết nối hoặc quyền truy cập của tài khoản.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => void state.reload()}
            >
              Thử lại
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-3 p-5" aria-label="Đang tải quyền">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        ) : !currentRole ? (
          <div className="px-5 py-14 text-center text-sm text-muted-foreground">
            Chưa có vai trò đang hoạt động.
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1.25fr)_auto] gap-5 border-b border-border bg-muted/30 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground xl:grid">
              <span>Định nghĩa quyền</span>
              <span>Module</span>
              <span>Thao tác cho phép</span>
              <span>Gán / Quản lý</span>
            </div>
            {rows.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <ShieldCheck className="mx-auto mb-3 size-10 text-muted-foreground/40" />
                <p className="font-semibold text-foreground">
                  Không tìm thấy quyền phù hợp
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Thử thay đổi bộ lọc hoặc tạo quyền mới.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {rows.map((permission) => (
                  <PermissionRow
                    key={permission.id}
                    permission={permission}
                    roleName={currentRole.name || "vai trò"}
                    assigned={
                      state.changes[permission.id] ??
                      state.originalIds.has(permission.id)
                    }
                    disabled={
                      state.assigned.isPending || state.savingAssignments
                    }
                    onAssignmentChange={(enabled) =>
                      state.setAssignment(permission.id, enabled)
                    }
                    onEdit={() => openForm(permission)}
                    onDelete={() => setDeleting(permission)}
                  />
                ))}
              </div>
            )}
            <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
              <span className="text-xs text-muted-foreground">
                Hiển thị {first}–{last} trong {total} quyền
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={state.page === 0}
                  onClick={() => state.setPage(state.page - 1)}
                >
                  <ChevronLeft className="size-4" /> Trước
                </Button>
                <span className="px-2 text-xs text-muted-foreground">
                  Trang {state.page + 1}/
                  {Math.max(1, Math.ceil(total / state.pageSize))}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={last >= total}
                  onClick={() => state.setPage(state.page + 1)}
                >
                  Sau <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {state.pendingCount > 0 && (
        <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-background p-4 shadow-xl">
          <div>
            <p className="text-sm font-bold text-foreground">
              {state.pendingCount} thay đổi chưa lưu
            </p>
            <p className="text-xs text-muted-foreground">
              Lưu để cập nhật quyền của {currentRole?.name || "vai trò này"}.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={state.discardChanges}
              disabled={state.savingAssignments}
            >
              Bỏ thay đổi
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={state.saveAssignments}
              disabled={state.savingAssignments || state.assigned.isPending}
            >
              {state.savingAssignments ? "Đang lưu..." : "Lưu phân quyền"}
            </Button>
          </div>
        </div>
      )}

      {formOpen && (
        <PermissionFormDialog
          key={editing?.id || "new"}
          open={formOpen}
          permission={editing}
          modules={modules}
          busy={state.savingDefinition}
          onOpenChange={setFormOpen}
          onSubmit={(values) => state.saveDefinition(values, editing?.id)}
        />
      )}

      {deleting && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open && !state.deletingDefinition) setDeleting(null);
          }}
        >
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Xóa định nghĩa quyền?</DialogTitle>
              <DialogDescription>
                Quyền{" "}
                <strong className="text-foreground">
                  {deleting.name || deleting.id}
                </strong>{" "}
                sẽ bị xóa mềm và gỡ khỏi các vai trò đang được gán.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                disabled={state.deletingDefinition}
                onClick={() => setDeleting(null)}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                disabled={state.deletingDefinition}
                onClick={async () => {
                  try {
                    await state.deleteDefinition(deleting.id);
                    setDeleting(null);
                  } catch {
                    /* Toast is shown in the hook. */
                  }
                }}
              >
                {state.deletingDefinition ? "Đang xóa..." : "Xóa quyền"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
