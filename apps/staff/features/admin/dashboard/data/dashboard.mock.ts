import type { DashboardRange } from "./dashboardRange";
import { previousDashboardRange } from "./dashboardRange";
import type {
  DashboardData,
  DashboardMetric,
} from "../schemas/dashboard.schema";

export interface FinancialDay {
  date: string;
  gmv: number;
  grossRevenue: number;
  tutorPayouts: number;
  refunds: number;
  paymentFees: number;
  netRevenue: number;
  operatingCosts: number;
  profit: number;
  successfulPayments: number;
  failedPayments: number;
  newUsers: number;
}

export interface FinancialSummary extends Omit<
  FinancialDay,
  "date" | "newUsers"
> {
  payingUsers: number;
  takeRate: number | null;
  profitMargin: number | null;
  refundRate: number | null;
  arppu: number | null;
  averageTransactionValue: number | null;
}

export interface ActivitySummary {
  activeUsers: number;
  newUsers: number;
  uniqueSearchingUsers: number;
  activeTutors: number;
  tutorsWithAvailability: number;
  tutorsWithZeroConnectRequests: number;
  zeroResultSearches: number | null;
  zeroResultRate: number | null;
  searchConnectRate: number | null;
  connectChatRate: number | null;
  aiConnectRequests: number | null;
  aiSearchConnectRate: number | null;
  medianResponseTimeSeconds: number;
  responseRate: number | null;
  unansweredConnectRequests: number | null;
}

export interface MockDashboard {
  financial: FinancialSummary;
  previousFinancial: FinancialSummary;
  activity: ActivitySummary;
  previousActivity: Pick<ActivitySummary, "activeUsers" | "activeTutors">;
  financialSeries: FinancialDay[];
}

const DAY_MS = 86_400_000;
const PLATFORM_TAKE_RATE = 0.2;
const REFUND_SHARE = 0.012;
const PAYMENT_FEE_SHARE = 0.008;

function metricValue(metric?: DashboardMetric | null): number | null {
  return metric?.value ?? null;
}

function ratio(
  numerator: number | null,
  denominator: number | null,
): number | null {
  return numerator !== null && denominator !== null && denominator > 0
    ? (numerator / denominator) * 100
    : null;
}

function mockFinancialDay(date: Date, dayFraction: number, paymentFactor: number, userFactor: number): FinancialDay {
  const dayIndex = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS,
  );
  const weekdayFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.72 : 1;
  const gradualGrowth = Math.max(0.65, 1 + (dayIndex - 20_000) * 0.00032);
  const successfulPayments = Math.max(
    0,
    Math.round((49 + ((dayIndex * 17) % 15)) * weekdayFactor * gradualGrowth * dayFraction * paymentFactor),
  );
  const failedPayments = Math.max(
    0,
    Math.round(successfulPayments * (0.035 + (dayIndex % 4) * 0.004)),
  );
  const averageTicket = 460_000 + (dayIndex % 7) * 20_000;
  const gmv = successfulPayments * averageTicket;
  const grossRevenue = Math.round(gmv * PLATFORM_TAKE_RATE);
  const tutorPayouts = gmv - grossRevenue;
  const refunds = Math.round(gmv * REFUND_SHARE);
  const paymentFees = Math.round(gmv * PAYMENT_FEE_SHARE);
  const netRevenue = grossRevenue - refunds - paymentFees;
  const operatingCosts = Math.round(2_000_000 * dayFraction * Math.max(0.1, paymentFactor)) + successfulPayments * 25_000;
  const profit = netRevenue - operatingCosts;
  const newUsers = Math.max(
    0,
    Math.round((7 + (dayIndex % 7)) * gradualGrowth * dayFraction * userFactor),
  );

  return {
    date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
    gmv,
    grossRevenue,
    tutorPayouts,
    refunds,
    paymentFees,
    netRevenue,
    operatingCosts,
    profit,
    successfulPayments,
    failedPayments,
    newUsers,
  };
}

function daysInRange(range: DashboardRange, paymentFactor: number, userFactor: number): FinancialDay[] {
  const days: FinancialDay[] = [];
  const cursor = new Date(
    range.from.getFullYear(),
    range.from.getMonth(),
    range.from.getDate(),
  );
  const finalDay = new Date(
    range.to.getFullYear(),
    range.to.getMonth(),
    range.to.getDate(),
  );
  while (cursor <= finalDay) {
    const isFinalDay = cursor.getTime() === finalDay.getTime();
    const elapsed = range.to.getHours() * 3_600_000 + range.to.getMinutes() * 60_000 + range.to.getSeconds() * 1_000 + range.to.getMilliseconds();
    const dayFraction = isFinalDay ? Math.max(0, Math.min(1, elapsed / DAY_MS)) : 1;
    days.push(mockFinancialDay(cursor, dayFraction, paymentFactor, userFactor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function financialSummary(days: FinancialDay[], maxPayingUsers: number): FinancialSummary {
  const totals = days.reduce(
    (sum, day) => ({
      gmv: sum.gmv + day.gmv,
      grossRevenue: sum.grossRevenue + day.grossRevenue,
      tutorPayouts: sum.tutorPayouts + day.tutorPayouts,
      refunds: sum.refunds + day.refunds,
      paymentFees: sum.paymentFees + day.paymentFees,
      netRevenue: sum.netRevenue + day.netRevenue,
      operatingCosts: sum.operatingCosts + day.operatingCosts,
      profit: sum.profit + day.profit,
      successfulPayments: sum.successfulPayments + day.successfulPayments,
      failedPayments: sum.failedPayments + day.failedPayments,
      newUsers: sum.newUsers + day.newUsers,
    }),
    {
      gmv: 0,
      grossRevenue: 0,
      tutorPayouts: 0,
      refunds: 0,
      paymentFees: 0,
      netRevenue: 0,
      operatingCosts: 0,
      profit: 0,
      successfulPayments: 0,
      failedPayments: 0,
      newUsers: 0,
    },
  );
  // A paying user can make several lesson payments during a longer period.
  const payingUsers = Math.min(
    totals.successfulPayments,
    maxPayingUsers,
    Math.round((totals.successfulPayments * 0.82) / Math.sqrt(Math.max(1, days.length))),
  );
  return {
    gmv: totals.gmv,
    grossRevenue: totals.grossRevenue,
    tutorPayouts: totals.tutorPayouts,
    refunds: totals.refunds,
    paymentFees: totals.paymentFees,
    netRevenue: totals.netRevenue,
    operatingCosts: totals.operatingCosts,
    profit: totals.profit,
    successfulPayments: totals.successfulPayments,
    failedPayments: totals.failedPayments,
    payingUsers,
    takeRate: ratio(totals.grossRevenue, totals.gmv),
    profitMargin: ratio(totals.profit, totals.netRevenue),
    refundRate: ratio(totals.refunds, totals.gmv),
    arppu: payingUsers > 0 ? totals.grossRevenue / payingUsers : null,
    averageTransactionValue:
      totals.successfulPayments > 0
        ? totals.gmv / totals.successfulPayments
        : null,
  };
}

function mockActivity(
  days: FinancialDay[],
  summary: DashboardData["summary"],
): ActivitySummary {
  const totalUsers = metricValue(summary.totalUsers);
  const totalTutors = metricValue(summary.totalTutors);
  const totalSearches = metricValue(summary.totalSearches);
  const totalAiSearches = metricValue(summary.totalAiSearches);
  const totalConnectRequests = metricValue(summary.totalConnectRequests);
  const totalChatRooms = metricValue(summary.totalChatRooms);
  const dayCount = days.length;
  const newUsers = Math.min(
    totalUsers ?? Infinity,
    days.reduce((sum, day) => sum + day.newUsers, 0),
  );
  const activeUsers = Math.min(
    totalUsers ?? Infinity,
    Math.round(75 + dayCount * 6 + newUsers * 0.36),
  );
  const activeTutors = Math.min(
    totalTutors ?? Infinity,
    Math.max(
      metricValue(summary.onlineTutors) ?? 0,
      Math.round(45 + dayCount * 4 + newUsers * 0.06),
    ),
  );
  const uniqueSearchingUsers = Math.min(
    totalSearches ?? Infinity,
    activeUsers,
    Math.round(activeUsers * 0.62),
  );
  const tutorsWithAvailability = Math.round(activeTutors * 0.76);
  const tutorsWithZeroConnectRequests = Math.round(activeTutors * 0.18);
  const zeroResultSearches =
    totalSearches === null
      ? null
      : Math.min(totalSearches, Math.round(totalSearches * 0.064));
  const unansweredConnectRequests =
    totalConnectRequests === null
      ? null
      : Math.min(
          totalConnectRequests,
          Math.round(totalConnectRequests * 0.083),
        );
  const aiConnectRequests =
    totalAiSearches === null || totalConnectRequests === null
      ? null
      : Math.min(totalConnectRequests, Math.round(totalAiSearches * 0.14));
  const averageResponseTimeSeconds = metricValue(
    summary.averageResponseTimeSeconds,
  );

  return {
    activeUsers,
    newUsers,
    uniqueSearchingUsers,
    activeTutors,
    tutorsWithAvailability,
    tutorsWithZeroConnectRequests,
    zeroResultSearches,
    zeroResultRate: ratio(zeroResultSearches, totalSearches),
    searchConnectRate: ratio(totalConnectRequests, totalSearches),
    connectChatRate: ratio(totalChatRooms, totalConnectRequests),
    aiConnectRequests,
    aiSearchConnectRate: ratio(aiConnectRequests, totalAiSearches),
    medianResponseTimeSeconds:
      averageResponseTimeSeconds === null
        ? 105
        : Math.round(averageResponseTimeSeconds * 0.72),
    responseRate:
      unansweredConnectRequests === null || totalConnectRequests === null
        ? null
        : ratio(
            totalConnectRequests - unansweredConnectRequests,
            totalConnectRequests,
          ),
    unansweredConnectRequests,
  };
}

export function createMockDashboard(
  range: DashboardRange,
  summary: DashboardData["summary"],
): MockDashboard {
  // Scale the mock flow to the real platform snapshot, so demo payments do not dwarf a small test tenant.
  const userFactor = Math.min(1, (metricValue(summary.totalUsers) ?? 1_500) / 1_500);
  const paymentFactor = Math.min(userFactor, (metricValue(summary.totalTutors) ?? 300) / 300);
  const days = daysInRange(range, paymentFactor, userFactor);
  const previousDays = daysInRange(previousDashboardRange(range), paymentFactor, userFactor);
  const activity = mockActivity(days, summary);
  const previousActivity = mockActivity(previousDays, summary);
  return {
    financial: financialSummary(days, activity.activeUsers),
    previousFinancial: financialSummary(previousDays, previousActivity.activeUsers),
    activity,
    previousActivity: {
      activeUsers: previousActivity.activeUsers,
      activeTutors: previousActivity.activeTutors,
    },
    financialSeries: days,
  };
}
