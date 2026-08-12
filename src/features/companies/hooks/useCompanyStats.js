import { useCallback, useEffect, useState } from "react";
import {
  CompaniesRequestError,
  getCompanyStatsRequest,
} from "../api/companiesApi";

const EMPTY_STATS = {
  totalCompanies: 0,
  activeCompanies: 0,
  newCompaniesThisMonth: 0,
  totalMembers: 0,
};

const useCompanyStats = () => {
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState({
    error: "",
    requestVersion: -1,
    stats: EMPTY_STATS,
  });
  const isLoading = state.requestVersion !== requestVersion;

  const retry = useCallback(() => {
    setRequestVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    getCompanyStatsRequest({ signal: controller.signal })
      .then((stats) => {
        setState({
          error: "",
          requestVersion,
          stats: { ...EMPTY_STATS, ...stats },
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        setState({
          error: error instanceof CompaniesRequestError
            ? error.message
            : "Something went wrong while loading company statistics. Please try again.",
          requestVersion,
          stats: EMPTY_STATS,
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

export default useCompanyStats;
