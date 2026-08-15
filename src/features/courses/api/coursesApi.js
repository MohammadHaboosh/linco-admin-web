import { apiFetch } from "../../../api/apiFetch";

export class CoursesRequestError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "CoursesRequestError";
    this.status = status;
  }
}

export const getCourseStatsRequest = async ({ signal } = {}) => {
  try {
    const response = await apiFetch("/courses/stats", {
      method: "GET",
      signal,
    });
    const payload = await response.json();

    if (!response.ok || !payload?.success) {
      throw new CoursesRequestError(
        payload?.message || "Failed to load course statistics",
        response.status,
      );
    }
    return payload.data;
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new CoursesRequestError("Could not reach the server.");
  }
};

export const getCoursesRequest = async (
  { page = 1, take = 10, search = "", status = "" } = {},
  { signal } = {},
) => {
  const parameters = new URLSearchParams({
    page: String(page),
    take: String(take),
  });
  if (search.trim()) parameters.set("search", search.trim());
  if (status) parameters.set("status", status);

  try {
    const response = await apiFetch(`/courses?${parameters.toString()}`, {
      method: "GET",
      signal,
    });
    const payload = await response.json();

    if (!response.ok || !payload?.success) {
      throw new CoursesRequestError(
        payload?.message || "Failed to load courses",
        response.status,
      );
    }
    return { courses: payload.data, meta: payload.meta };
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new CoursesRequestError("Could not reach the server.");
  }
};
