import type { ReactNode } from "react";
import { Button } from "@workspace/ui/components/ui/button";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";

const BEE_DIVING = "https://res.cloudinary.com/xcrm6ykz/image/upload/v1789966155/10.png";

interface LmsDataStateProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  /** Skeleton matching the shape of the real content. */
  skeleton: ReactNode;
  onRetry?: () => void;
  errorTitle?: string;
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  children: ReactNode;
}

export function LmsDataState({ isLoading, isError, isEmpty, skeleton, onRetry, errorTitle = "Không tải được dữ liệu", emptyTitle, emptyDescription, emptyAction, children }: LmsDataStateProps) {
  if (isLoading) return <div aria-busy="true">{skeleton}</div>;
  if (isError) {
    return (
      <EmptyState
        role="alert"
        imageSrc={BEE_DIVING}
        imageAlt=""
        title={errorTitle}
        description="Kiểm tra kết nối mạng rồi thử lại."
        action={onRetry && <Button variant="outline" className="min-h-11" onClick={onRetry}>Thử lại</Button>}
      />
    );
  }
  if (isEmpty) return <EmptyState imageAlt="" title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  return <>{children}</>;
}
