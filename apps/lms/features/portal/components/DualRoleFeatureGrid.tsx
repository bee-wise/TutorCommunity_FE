import { RoleFeatureShowcase } from "./RoleFeatureShowcase";
import { learnerFeatures, tutorFeatures } from "../data/roleFeatures";

export function DualRoleFeatureGrid() {
  return (
    <section className="overflow-x-clip bg-[#fbfaf7] py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-20">
          <h2
            className="text-3xl font-extrabold tracking-[-0.035em] text-primary sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-nunito-family)" }}
          >
            <span className="text-accent">BeeWise LMS</span> có gì nổi bật?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#37333d]">
            Một không gian học tập rõ ràng cho học viên và công cụ quản lý gọn
            gàng cho gia sư.
          </p>
        </div>

        <RoleFeatureShowcase
          id="learner"
          roleLabel="Không gian học viên"
          heading="Tính năng dành cho học viên"
          imageSide="left"
          features={learnerFeatures}
        />

        <RoleFeatureShowcase
          id="tutor"
          roleLabel="Không gian gia sư"
          heading="Tính năng dành cho gia sư"
          imageSide="right"
          features={tutorFeatures}
          className="mt-20 sm:mt-28"
        />
      </div>
    </section>
  );
}
