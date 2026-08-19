import { useCallback, useEffect, useState } from "react";
import {
  DashboardReportsRequestError,
  getDashboardReportsRequest,
} from "../api/reportsApi";

const useDashboardReports = () => {
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState({
    error: "",
    reports: null,
    requestVersion: -1,
  });
  const isLoading = state.requestVersion !== requestVersion;

  const retry = useCallback(() => {
    setRequestVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    getDashboardReportsRequest({ signal: controller.signal })
      .then((reports) => {
        setState({
          error: "",
          reports,
          requestVersion,
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        setState({
          error: error instanceof DashboardReportsRequestError
            ? error.message
            : "Something went wrong while loading reports. Please try again.",
          reports: null,
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

export default useDashboardReports;
