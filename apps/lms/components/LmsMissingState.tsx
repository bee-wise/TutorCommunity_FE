import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";

/** Full-page state for a record that does not exist or is not accessible, with one way back. */
export function LmsMissingState({ title, description, href, backLabel }: { title: string; description?: string; href: string; backLabel: string }) {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
      <EmptyState
        role="alert"
        imageSrc="https://res.cloudinary.com/xcrm6ykz/image/upload/v1789966155/10.png"
        imageAlt=""
        title={title}
        description={description}
        action={<Button asChild variant="outline" className="min-h-11"><Link href={href}>{backLabel}</Link></Button>}
      />
    </div>
  );
}
