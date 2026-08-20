"use client";

import { useCommunityStore } from "../store/community-store";
import {
  mockGuest,
  mockLearnerNoSession,
  mockLearnerWithActiveSession,
  mockTutor,
} from "../lib/mock-community-data";
import { UserProfile } from "../types/community";
import { Button } from "@workspace/ui/components/ui/button";

export function RoleSwitcherMockBar() {
  const { currentUser, setCurrentUser } = useCommunityStore();

  const handleSwitchRole = (user: UserProfile) => {
    setCurrentUser(user);
  };

  return (
    <div className="bg-slate-100 border-b border-slate-200 p-2 text-sm z-50 sticky top-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="font-semibold text-slate-700 flex items-center gap-2">
          <span>Role Tester:</span>
          <span className="text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
            {currentUser.displayName} ({currentUser.role})
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={currentUser.id === mockLearnerNoSession.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleSwitchRole(mockLearnerNoSession)}
            className="text-xs h-8"
          >
            Learner (Sẵn sàng)
          </Button>
          <Button
            variant={currentUser.id === mockLearnerWithActiveSession.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleSwitchRole(mockLearnerWithActiveSession)}
            className="text-xs h-8"
          >
            Learner (Đang có session)
          </Button>
          <Button
            variant={currentUser.id === mockTutor.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleSwitchRole(mockTutor)}
            className="text-xs h-8"
          >
            Tutor
          </Button>
          <Button
            variant={currentUser.id === mockGuest.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleSwitchRole(mockGuest)}
            className="text-xs h-8"
          >
            Guest
          </Button>
        </div>
      </div>
    </div>
  );
}
