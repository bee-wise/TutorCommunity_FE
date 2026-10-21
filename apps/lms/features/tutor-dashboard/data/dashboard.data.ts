import { MOCK_SESSIONS } from "@/features/tutor-schedule/data/mock-sessions";
import { getUpcomingDashboardSessions } from "../utils/dashboard-schedule.utils";

// Reuse the schedule's demo records so session details do not disagree across pages.
export const DASHBOARD_SESSIONS = getUpcomingDashboardSessions(MOCK_SESSIONS).slice(0, 5);
