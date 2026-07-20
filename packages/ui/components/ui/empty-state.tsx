import * as React from "react";
import Image from "next/image";
import { cn } from "@workspace/core/helpers/utils";

export interface EmptyStateProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  /**
   * Tiêu đề của trạng thái rỗng
   */
  title: React.ReactNode;
  /**
   * Mô tả chi tiết (tùy chọn)
   */
  description?: React.ReactNode;
  /**
   * Nút hành động (tùy chọn), ví dụ: <Button>Tải lại</Button>
   */
  action?: React.ReactNode;
  /**
   * Đường dẫn ảnh (mặc định là 404Sticker.svg)
   */
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export function EmptyState({
  title,
  description,
  action,
  imageSrc = "/images/404Sticker.svg",
  imageAlt = "Empty state illustration",
  imageWidth = 240,
  imageHeight = 240,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center py-12 px-4 text-center sm:py-16",
        className,
      )}
      {...props}
    >
      {imageSrc && (
        <div className="relative mb-6 shrink-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            className="object-contain"
            priority={false}
          />
        </div>
      )}
      <h3 className="mb-2 text-xl font-extrabold text-foreground md:text-2xl">
        {title}
      </h3>
      {description && (
        <p className="mb-6 max-w-[40ch] text-sm text-muted-foreground md:text-base">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
