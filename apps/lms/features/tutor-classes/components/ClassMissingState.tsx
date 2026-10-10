import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { classHeading, classOutlineButton, classPage, classPanel } from "./classes-ui";

export function ClassMissingState() {
  return <div className={classPage}><section className={`${classPanel} space-y-4`}>
    <h1 className={classHeading}>Không tìm thấy lớp học</h1>
    <p className="text-sm leading-relaxed text-muted-foreground">Lớp không tồn tại trong dữ liệu minh họa hiện tại.</p>
    <Button asChild variant="outline" className={classOutlineButton}><Link href="/lms/tutor/classes">Danh sách lớp</Link></Button>
  </section></div>;
}
