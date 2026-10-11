import Image from "next/image";
import { BookOpenIcon, CalendarDaysIcon, ChartBarIcon, UsersIcon, SparklesIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import type { RoleFeature } from "../data/roleFeatures";
import styles from "../styles/portal.module.css";

const VISUALS = {
  "learner-schedule": { icon: CalendarDaysIcon, label: "Lịch của lớp" },
  "learner-materials": { icon: BookOpenIcon, label: "Tài liệu buổi học" },
  "learner-progress": { icon: ChartBarIcon, label: "Báo cáo học tập" },
  "tutor-learners": { icon: UsersIcon, label: "Lớp 1:1 & lớp nhóm" },
  "tutor-ai": { icon: SparklesIcon, label: "Tài liệu từ bản ghi Zoom" },
  "tutor-progress": { icon: CurrencyDollarIcon, label: "Thu nhập theo buổi" },
} as const;

export function RoleFeatureVisual({ feature }: { feature: RoleFeature }) {
  if (feature.imageSrc) {
    return (
      <div className="relative aspect-[1.2] w-full sm:aspect-[1.35]">
        <Image src={feature.imageSrc} alt={feature.imageAlt} fill sizes="(max-width: 1023px) 100vw, 55vw" className="object-contain" />
      </div>
    );
  }
  const visual = VISUALS[feature.id as keyof typeof VISUALS];
  if (!visual) return null;
  const Icon = visual.icon;
  return (
    <div>
      <div className={styles.featureVisual} aria-hidden="true">
        <span className={styles.orbit} />
        <span className={styles.orbit} />
        <span className={styles.orbit} />
        <span className={styles.featureGlyph}><Icon /></span>
      </div>
      <p className="text-center text-xl font-semibold tracking-[-0.02em] text-primary sm:text-2xl">{visual.label}</p>
    </div>
  );
}
