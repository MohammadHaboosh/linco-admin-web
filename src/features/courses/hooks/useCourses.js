import { useCallback, useEffect, useState } from "react";
import { getCoursesRequest, CoursesRequestError } from "../api/coursesApi";

const EMPTY_META = {
  page: 1,
  take: 10,
  itemCount: 0,
  pageCount: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

const useCourses = ({ page, take, search, visibility }) => {
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState({
    courses: [],
    meta: { ...EMPTY_META, page, take },
    error: "",
    requestKey: "",
  });

  const requestKey = `${page}:${take}:${search}:${visibility}:${requestVersion}`;
  const isLoading = state.requestKey !== requestKey;

  const retry = useCallback(() => setRequestVersion((c) => c + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    getCoursesRequest(
      { page, take, search, visibility },
      { signal: controller.signal },
    )
      .then(({ courses, meta }) => {
        setState({
          courses,
          meta: { ...EMPTY_META, ...meta },
          error: "",
          requestKey,
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setState({
          courses: [],
          meta: { ...EMPTY_META, page, take },
          error:
            error instanceof CoursesRequestError
              ? error.message
              : "Failed to load courses.",
          requestKey,
        });
      });

    return () => controller.abort();
  }, [page, requestKey, search, take, visibility]);

  return { ...state, error: isLoading ? "" : state.error, isLoading, retry };
};

export default useCourses;
