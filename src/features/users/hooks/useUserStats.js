import { useCallback, useEffect, useState } from "react";
import { getUserStatsRequest, UsersRequestError } from "../api/usersApi";

const EMPTY_STATS = {
  totalUsers: 0,
  verifiedAccounts: 0,
  newThisMonth: 0,
  twoFactorEnabled: 0,
};

const useUserStats = () => {
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState({
    stats: EMPTY_STATS,
    error: "",
    requestVersion: -1,
  });
  const isLoading = state.requestVersion !== requestVersion;

  const retry = useCallback(() => {
    setRequestVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    getUserStatsRequest({ signal: controller.signal })
      .then((stats) => {
        setState({
          stats: { ...EMPTY_STATS, ...stats },
          error: "",
          requestVersion,
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        setState({
          stats: EMPTY_STATS,
          error: error instanceof UsersRequestError
            ? error.message
            : "Something went wrong while loading user statistics. Please try again.",
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

export default useUserStats;
