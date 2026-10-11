import { LmsHeader } from "./LmsHeader";
import { LmsHeroSection } from "./LmsHeroSection";
import { DualRoleFeatureGrid } from "./DualRoleFeatureGrid";
import { LmsAIFeaturesSection } from "./LmsAIFeaturesSection";
import { ClassActivationShowcase } from "./ConsultantShowcase";
import { FaqAndCtaSection } from "./FaqAndCtaSection";
import styles from "../styles/portal.module.css";

export function LmsPortal() {
  return (
    <main className={`${styles.portal} overflow-x-clip`}>
      <LmsHeader />
      <LmsHeroSection />
      <DualRoleFeatureGrid />
      <LmsAIFeaturesSection />
      <ClassActivationShowcase />
      <FaqAndCtaSection />
    </main>
  );
}
