import { ReactNode } from "react";
import { RoleSwitcherMockBar } from "../../features/community/components/RoleSwitcherMockBar";
import { CommunityBottomBar } from "../../features/community/components/CommunityBottomBar";

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <RoleSwitcherMockBar />
      <div className="pb-24">
        {children}
      </div>
      <CommunityBottomBar />
    </div>
  );
}
