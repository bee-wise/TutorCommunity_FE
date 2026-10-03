import { Check, MapPin, PencilSimple, Plus } from "@phosphor-icons/react";
import type { MeType } from "@workspace/core/types/auth.type";
import { cn } from "@workspace/core/helpers/utils";
import type { AccountProfileDemo } from "../hooks/useAccountProfileDemo";
import { formatBirthday, interestOptions } from "../types/account-profile";

export function ProfileBasicsPanel({ user, demo }: { user: MeType; demo: AccountProfileDemo }) {
  const fields = [
    { label: "Họ và tên", value: demo.profile.fullName },
    { label: "Email đăng nhập", value: user.email },
    { label: "Số điện thoại", value: demo.profile.phoneNumber },
    { label: "Ngày sinh", value: formatBirthday(demo.profile.birthday) },
  ];

  return (
    <div className="space-y-5">
      <section aria-labelledby="personal-heading" className="rounded-2xl border border-border bg-card p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div><h2 id="personal-heading" className="font-nunito text-xl font-extrabold text-foreground">Thông tin cá nhân</h2><p className="mt-1 text-sm text-muted-foreground">Một chút thông tin để mọi người hiểu bạn hơn.</p></div>
          <button type="button" aria-label="Chỉnh sửa thông tin cá nhân" onClick={() => demo.setEditing(true)} className="rounded-lg border border-border p-2 text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><PencilSimple size={18} weight="bold" aria-hidden="true" /></button>
        </div>
        <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {fields.map(({ label, value }) => <div key={label}><dt className="text-xs font-medium text-muted-foreground">{label}</dt><dd className={cn("mt-1.5 break-words text-sm", value && value !== "Chưa cập nhật" ? "font-bold text-foreground" : "text-muted-foreground")}>{value || "Chưa cập nhật"}</dd></div>)}
        </dl>
        <div className="mt-6 flex items-center gap-2 border-t border-border pt-5 text-sm"><MapPin size={18} className="shrink-0 text-primary" aria-hidden="true" /><span className={demo.profile.location ? "font-semibold text-foreground" : "text-muted-foreground"}>{demo.profile.location || "Thêm thành phố bạn đang sống"}</span></div>
      </section>

      <section aria-labelledby="bio-heading" className="rounded-2xl border border-border bg-card p-6 sm:p-7">
        <h2 id="bio-heading" className="font-nunito text-xl font-extrabold text-foreground">Vài điều về tôi</h2>
        {demo.profile.bio ? <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-foreground">{demo.profile.bio}</p> : <div className="mt-4 rounded-xl border border-dashed border-border bg-muted p-5"><p className="text-sm leading-6 text-muted-foreground">Bạn đang theo đuổi điều gì? Chia sẻ sở thích hoặc mục tiêu học tập của mình.</p><button type="button" onClick={() => demo.setEditing(true)} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><Plus size={16} weight="bold" aria-hidden="true" />Thêm giới thiệu</button></div>}
      </section>

      <section aria-labelledby="interests-heading" className="rounded-2xl border border-border bg-card p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3"><h2 id="interests-heading" className="font-nunito text-xl font-extrabold text-foreground">Sở thích học tập</h2><span className="text-xs font-bold text-muted-foreground">{demo.interests.length}/5 đã chọn</span></div>
        <p className="mt-1 text-sm text-muted-foreground">Chọn những chủ đề bạn muốn khám phá.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {interestOptions.map((interest) => { const selected = demo.interests.includes(interest); return <button key={interest} type="button" aria-pressed={selected} onClick={() => demo.toggleInterest(interest)} className={cn("inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary hover:text-primary")}>{selected ? <Check size={14} weight="bold" aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}{interest}</button>; })}
        </div>
      </section>
    </div>
  );
}
