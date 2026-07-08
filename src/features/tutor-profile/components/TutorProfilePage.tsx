"use client";

import { mockTutorProfile } from "../data/mockTutorProfile";
import { TutorBioSection } from "./TutorBioSection";
import { TutorCertificates } from "./TutorCertificates";
import { TutorConnectCard } from "./TutorConnectCard";
import { TutorEducationAchievements } from "./TutorEducationAchievements";
import { TutorFeedback } from "./TutorFeedback";
import { TutorHero } from "./TutorHero";
import { TutorIntroVideo } from "./TutorIntroVideo";
import { TutorMobileCTA } from "./TutorMobileCTA";
import { TutorTeachingHistory } from "./TutorTeachingHistory";
import { TutorTeachingMethods } from "./TutorTeachingMethods";

export function TutorProfilePage() {
  const handleConnect = () => {
    // TODO: kết nối với luồng gửi yêu cầu kết nối.
  };

  const handleSave = () => {
    // TODO: kết nối với luồng lưu hồ sơ gia sư.
  };

  return (
    <div className="bg-[linear-gradient(180deg,#fff3cb_0%,#fffaf0_42%,#ffffff_100%)] py-6 sm:py-8 lg:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <TutorHero tutor={mockTutorProfile} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)] lg:items-start">
          <div className="space-y-6">
            <TutorBioSection tutor={mockTutorProfile} />
            <TutorTeachingMethods tutor={mockTutorProfile} />
            <TutorEducationAchievements tutor={mockTutorProfile} />
            <TutorIntroVideo />
            <TutorTeachingHistory tutor={mockTutorProfile} />
            <TutorCertificates />
            <TutorFeedback tutor={mockTutorProfile} />
          </div>

          <TutorConnectCard
            tutor={mockTutorProfile}
            onConnect={handleConnect}
            onSave={handleSave}
          />
        </div>
      </div>

      <TutorMobileCTA
        onConnect={handleConnect}
        rate={mockTutorProfile.hourlyRate}
      />
      <div className="pb-24 lg:pb-0" />
    </div>
  );
}
