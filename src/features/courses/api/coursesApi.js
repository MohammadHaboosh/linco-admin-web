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

const readApiData = async (response, fallbackMessage) => {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload?.success === false) {
    throw new CoursesRequestError(
      payload?.message || fallbackMessage,
      response.status,
    );
  }

  return payload?.data;
};

const normalizeCollection = (value, collectionKeys = []) => {
  if (Array.isArray(value)) return value;

  for (const key of collectionKeys) {
    if (Array.isArray(value?.[key])) return value[key];
  }

  return [];
};

const getPreviewCollection = async (
  path,
  collectionKeys,
  signal,
  allowSingleObject = false,
) => {
  const response = await apiFetch(path, { method: "GET", signal });
  const data = await readApiData(response, "Failed to load course content");
  const collection = normalizeCollection(data, collectionKeys);

  if (
    collection.length === 0 &&
    allowSingleObject &&
    data &&
    typeof data === "object" &&
    (data.id || data.title)
  ) {
    return [data];
  }

  return collection;
};

const settledValue = (result, fallback = []) =>
  result.status === "fulfilled" ? result.value : fallback;

export const getCoursePreviewRequest = async (courseId, { signal } = {}) => {
  if (!courseId) {
    throw new CoursesRequestError("A course ID is required.");
  }

  try {
    const sections = await getPreviewCollection(
      `/courses/${encodeURIComponent(courseId)}/sections/cursor`,
      ["sections", "items"],
      signal,
    );

    const hydratedSections = await Promise.all(
      sections.map(async (section) => {
        const sectionId = encodeURIComponent(section.id);
        const [lessonsResult, examsResult, questionsResult] =
          await Promise.allSettled([
            getPreviewCollection(
              `/sections/${sectionId}/lessons/cursor`,
              ["lessons", "items"],
              signal,
            ),
            getPreviewCollection(
              `/sections/${sectionId}/exams/cursor`,
              ["exams", "items"],
              signal,
              true,
            ),
            getPreviewCollection(
              `/sections/${sectionId}/questionsBank/cursor`,
              ["questions", "items"],
              signal,
            ),
          ]);

        if (signal?.aborted) {
          throw new DOMException("The request was aborted.", "AbortError");
        }

        const exams = settledValue(examsResult);

        return {
          ...section,
          lessons: settledValue(lessonsResult).sort(
            (first, second) => Number(first.order) - Number(second.order),
          ),
          quiz: exams[0] || null,
          questions: settledValue(questionsResult),
          previewErrors: {
            lessons: lessonsResult.status === "rejected",
            quiz: examsResult.status === "rejected",
            questions: questionsResult.status === "rejected",
          },
        };
      }),
    );

    return hydratedSections.sort(
      (first, second) => Number(first.order) - Number(second.order),
    );
  } catch (error) {
    if (error.name === "AbortError" || error instanceof CoursesRequestError) {
      throw error;
    }

    throw new CoursesRequestError("Could not load the course preview.");
  }
};

export const setCourseVisibilityRequest = async (
  courseId,
  visibility,
) => {
  if (!courseId) {
    throw new CoursesRequestError("A course ID is required.");
  }

  const response = await apiFetch(
    `/courses/${encodeURIComponent(courseId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ visibility }),
    },
  );

  return readApiData(response, "Failed to update course visibility");
};
