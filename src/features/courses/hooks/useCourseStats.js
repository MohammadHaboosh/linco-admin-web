import { useCallback, useEffect, useState } from "react";
import { getCourseStatsRequest, CoursesRequestError } from "../api/coursesApi";

const EMPTY_STATS = {
  totalCourses: 0,
  publishedCourses: 0,
  draftCourses: 0,
  totalEnrollments: 0,
  publicCourses: 0,
  privateCourses: 0,
};

const useCourseStats = () => {
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState({
    stats: EMPTY_STATS,
    error: "",
    requestVersion: -1,
  });

  const isLoading = state.requestVersion !== requestVersion;

  const retry = useCallback(() => setRequestVersion((c) => c + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    getCourseStatsRequest({ signal: controller.signal })
      .then((stats) => {
        setState({
          stats: { ...EMPTY_STATS, ...stats },
          error: "",
          requestVersion,
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") return;

        setState({
          stats: EMPTY_STATS,
          error:
            error instanceof CoursesRequestError
              ? error.message
              : "Failed to load stats.",
          requestVersion,
        });
      });

    return () => controller.abort();
  }, [requestVersion]);

  return {
    ...state,
    error: isLoading ? "" : state.error,
    isLoading,
    retry,
  };
};

export default useCourseStats;
