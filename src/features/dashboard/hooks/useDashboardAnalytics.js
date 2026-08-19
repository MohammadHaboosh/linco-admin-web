import { useCallback, useEffect, useState } from "react";
import {
  DashboardAnalyticsRequestError,
  getDashboardAnalyticsRequest,
} from "../api/dashboardApi";

const useDashboardAnalytics = () => {
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState({
    analytics: null,
    error: "",
    requestVersion: -1,
  });
  const isLoading = state.requestVersion !== requestVersion;

  const retry = useCallback(() => {
    setRequestVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    getDashboardAnalyticsRequest({ signal: controller.signal })
      .then((analytics) => {
        setState({
          analytics,
          error: "",
          requestVersion,
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        setState({
          analytics: null,
          error: error instanceof DashboardAnalyticsRequestError
            ? error.message
            : "Something went wrong while loading dashboard analytics. Please try again.",
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

export default useDashboardAnalytics;
