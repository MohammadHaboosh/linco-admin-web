import { apiFetch } from "../../../api/apiFetch";

const DASHBOARD_REPORTS_PATH = "/dashboard/reports";

export class DashboardReportsRequestError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "DashboardReportsRequestError";
    this.status = status;
  }
}

const isFiniteNumber = (value) => Number.isFinite(value);

const isEngagementPoint = (point) => (
  point
  && typeof point === "object"
  && typeof point.date === "string"
  && !Number.isNaN(new Date(point.date).getTime())
  && typeof point.label === "string"
  && isFiniteNumber(point.activeLearners)
  && isFiniteNumber(point.completedLearningPaths)
);

const isPlatformHealth = (health) => (
  health
  && typeof health === "object"
  && typeof health.period === "string"
  && typeof health.periodStart === "string"
  && !Number.isNaN(new Date(health.periodStart).getTime())
  && health.apiAvailability
  && typeof health.apiAvailability.measured === "boolean"
  && (health.apiAvailability.value === null || isFiniteNumber(health.apiAvailability.value))
  && health.courseCompletion
  && isFiniteNumber(health.courseCompletion.value)
  && isFiniteNumber(health.courseCompletion.completedAssignments)
  && isFiniteNumber(health.courseCompletion.totalAssignments)
  && health.workspaceActivation
  && isFiniteNumber(health.workspaceActivation.value)
  && isFiniteNumber(health.workspaceActivation.activatedWorkspaces)
  && isFiniteNumber(health.workspaceActivation.totalWorkspaces)
  && health.supportResponseSla
  && isFiniteNumber(health.supportResponseSla.value)
  && isFiniteNumber(health.supportResponseSla.responsesWithinSla)
  && isFiniteNumber(health.supportResponseSla.totalInquiries)
  && isFiniteNumber(health.supportResponseSla.targetHours)
);

const isReportsPayload = (data) => (
  data
  && typeof data === "object"
  && data.learningEngagement
  && typeof data.learningEngagement.period === "string"
  && Array.isArray(data.learningEngagement.points)
  && data.learningEngagement.points.every(isEngagementPoint)
  && isPlatformHealth(data.platformHealth)
);

export const getDashboardReportsRequest = async ({ signal } = {}) => {
  let response;

  try {
    response = await apiFetch(DASHBOARD_REPORTS_PATH, {
      method: "GET",
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new DashboardReportsRequestError(
      "We could not reach the LinCo server. Check your connection and try again.",
    );
  }

  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new DashboardReportsRequestError(
      "The reports response could not be read. Please try again.",
      response.status,
    );
  }

  if (!response.ok || payload?.success !== true) {
    throw new DashboardReportsRequestError(
      payload?.message || "Reports could not be loaded. Please try again.",
      response.status,
    );
  }

  if (!isReportsPayload(payload.data)) {
    throw new DashboardReportsRequestError(
      "The reports response was incomplete. Please try again.",
      response.status,
    );
  }

  return payload.data;
};
