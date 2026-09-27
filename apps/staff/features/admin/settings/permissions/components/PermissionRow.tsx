import { PencilSimple as Pencil, Trash as Trash2 } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";
import type { Permission } from "../schemas/permission.schema";

const operations = [
  { key: "isCreate", label: "Tạo" },
  { key: "isRead", label: "Xem" },
  { key: "isUpdate", label: "Sửa" },
  { key: "isDelete", label: "Xóa" },
] as const;

type Props = {
  permission: Permission;
  roleName: string;
  assigned: boolean;
  disabled: boolean;
  onAssignmentChange: (enabled: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function PermissionRow({
  permission,
  roleName,
  assigned,
  disabled,
  onAssignmentChange,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="grid gap-4 px-5 py-4 transition-colors hover:bg-muted/40 lg:px-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1.25fr)_auto] xl:items-center xl:gap-5">
      <div className="min-w-0">
        <p className="break-words text-sm font-semibold text-foreground">{permission.name || "Chưa đặt tên"}</p>
        <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground" title={permission.id}>{permission.id}</p>
      </div>

      <div>
        <span className="inline-flex max-w-full rounded-lg border border-border bg-muted/60 px-2.5 py-1.5 text-xs font-medium text-foreground">
          <span className="truncate">{permission.moduleName || "Không thuộc module"}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5" aria-label="Thao tác của định nghĩa quyền">
        {operations.map(({ key, label }) => (
          <span
            key={key}
            title={permission[key] ? `Cho phép ${label.toLowerCase()}` : `Không cho phép ${label.toLowerCase()}`}
            className={
              permission[key]
                ? "rounded-md bg-secondary/10 px-2 py-1 text-[11px] font-semibold text-secondary"
                : "rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground/65"
            }
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 xl:justify-end">
        <label className="inline-flex cursor-pointer items-center gap-2.5 text-xs font-medium text-foreground">
          <input
            type="checkbox"
            checked={assigned}
            disabled={disabled}
            onChange={(event) => onAssignmentChange(event.target.checked)}
            aria-label={`Gán quyền ${permission.name || permission.id} cho ${roleName}`}
            className="peer sr-only"
          />
          <span aria-hidden="true" className="relative h-5 w-9 shrink-0 rounded-full bg-muted-foreground/40 transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-primary-foreground after:shadow-sm after:transition-transform peer-checked:bg-primary peer-checked:after:translate-x-4 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring peer-disabled:opacity-50" />
          <span className="min-w-17">{assigned ? "Đã gán" : "Chưa gán"}</span>
        </label>
        <span className="flex items-center gap-0.5 border-l border-border pl-2">
          <Button variant="ghost" size="icon-sm" aria-label={`Sửa ${permission.name || "quyền"}`} title="Sửa quyền" onClick={onEdit}>
            <Pencil className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={`Xóa ${permission.name || "quyền"}`} title="Xóa quyền" className="text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="size-4" />
          </Button>
        </span>
      </div>
    </div>
  );
}
