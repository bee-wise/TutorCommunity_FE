import { RoleFeatureShowcase } from "./RoleFeatureShowcase";
import { PortalReveal } from "./PortalReveal";
import { PortalTitle } from "./PortalTitle";
import { learnerFeatures, tutorFeatures } from "../data/roleFeatures";

export function DualRoleFeatureGrid() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <PortalReveal className="mb-12 max-w-2xl lg:mb-16">
          <PortalTitle primary="Một nơi để theo dõi " accent="lớp học." className="text-[clamp(2rem,3.5vw,3rem)]" />
        </PortalReveal>
        <RoleFeatureShowcase id="learner" roleLabel="Học viên" heading="Bạn học, " accentHeading="LMS giúp theo dõi." imageSide="left" features={learnerFeatures} />
        <RoleFeatureShowcase id="tutor" roleLabel="Gia sư" heading="Quản lý lớp, " accentHeading="chuẩn bị bài dạy." imageSide="right" features={tutorFeatures} className="mt-20 border-t border-border pt-20 sm:mt-24 sm:pt-24" />
      </div>
    </section>
  );
}
