import { getLearnerDashboardMock } from "../services/learner-dashboard.mock.service";
import { LearnerDashboard } from "./LearnerDashboard";

export function LearnerReportScreen() {
  return <LearnerDashboard data={getLearnerDashboardMock()} />;
}