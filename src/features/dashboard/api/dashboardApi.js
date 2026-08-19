import { apiFetch } from "../../../api/apiFetch";

const DASHBOARD_ANALYTICS_PATH = "/dashboard/analytics";
const SUMMARY_FIELDS = [
  "registeredCompanies",
  "activeLearners",
  "publishedCourses",
  "completionRate",
];

export class DashboardAnalyticsRequestError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "DashboardAnalyticsRequestError";
    this.status = status;
  }
}

const isMetric = (metric) => (
  metric
  && typeof metric === "object"
  && Number.isFinite(metric.value)
  && Number.isFinite(metric.changePercentage)
);

const isGrowthPoint = (point) => (
  point
  && typeof point === "object"
  && typeof point.date === "string"
  && !Number.isNaN(new Date(point.date).getTime())
  && typeof point.label === "string"
  && Number.isFinite(point.value)
);

const isDistributionItem = (item) => (
  item
  && typeof item === "object"
  && typeof item.role === "string"
  && Number.isFinite(item.count)
  && Number.isFinite(item.percentage)
);

const isAnalyticsPayload = (data) => (
  data
  && typeof data === "object"
  && data.summary
  && SUMMARY_FIELDS.every((field) => isMetric(data.summary[field]))
  && data.activeLearnerGrowth
  && typeof data.activeLearnerGrowth.period === "string"
  && Number.isFinite(data.activeLearnerGrowth.total)
  && Number.isFinite(data.activeLearnerGrowth.changePercentage)
  && Array.isArray(data.activeLearnerGrowth.points)
  && data.activeLearnerGrowth.points.every(isGrowthPoint)
  && data.userDistribution
  && Number.isFinite(data.userDistribution.total)
  && Array.isArray(data.userDistribution.items)
  && data.userDistribution.items.every(isDistributionItem)
);

export const getDashboardAnalyticsRequest = async ({ signal } = {}) => {
  let response;

  try {
    response = await apiFetch(DASHBOARD_ANALYTICS_PATH, {
      method: "GET",
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new DashboardAnalyticsRequestError(
      "We could not reach the LinCo server. Check your connection and try again.",
    );
  }

  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new DashboardAnalyticsRequestError(
      "The dashboard analytics response could not be read. Please try again.",
      response.status,
    );
  }

  if (!response.ok || payload?.success !== true) {
    throw new DashboardAnalyticsRequestError(
      payload?.message || "Dashboard analytics could not be loaded. Please try again.",
      response.status,
    );
  }

  if (!isAnalyticsPayload(payload.data)) {
    throw new DashboardAnalyticsRequestError(
      "The dashboard analytics response was incomplete. Please try again.",
      response.status,
    );
  }

  return payload.data;
};
