import {
  APPLICATION_STATUSES,
  AppForm,
  getApplicationDate,
} from "./applications";

const STATUS_COLORS: Record<(typeof APPLICATION_STATUSES)[number], string> = {
  rejected: "#B42318",
  applied: "#1D4F00",
  interview: "#14E9FE",
  assessment: "#9CDD75",
  offer: "#75C544",
  screening: "#4D6447",
};

export function getApplicationStats(applications: AppForm[]) {
  const statusCounts = Object.fromEntries(
    APPLICATION_STATUSES.map((status) => [
      status,
      applications.filter((application) => application.status === status)
        .length,
    ]),
  ) as Record<(typeof APPLICATION_STATUSES)[number], number>;

  const total = applications.length;

  return {
    total,
    statusCounts,
    dailyCount: countApplicationsSince(applications, 1),
    weeklyCount: countApplicationsSince(applications, 7),
    monthlyCount: countApplicationsSince(applications, 21),
    percentage: (count: number) => (total ? (count / total) * 100 : 0),
    pieData: APPLICATION_STATUSES.map((status) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCounts[status],
      color: STATUS_COLORS[status],
    })).filter(({ value }) => value > 0),
  };
}

function countApplicationsSince(applications: AppForm[], days: number) {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - days);

  return applications.filter(
    (application) => getApplicationDate(application.date_applied) >= threshold,
  ).length;
}
