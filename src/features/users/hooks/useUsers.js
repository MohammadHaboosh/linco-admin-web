import { useCallback, useEffect, useState } from "react";
import { getUsersRequest, UsersRequestError } from "../api/usersApi";

const EMPTY_META = {
  page: 1,
  take: 10,
  itemCount: 0,
  pageCount: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

const useUsers = ({ page, take, search }) => {
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState({
    users: [],
    meta: { ...EMPTY_META, page, take },
    error: "",
    requestKey: "",
  });
  const requestKey = `${page}:${take}:${search}:${requestVersion}`;
  const isLoading = state.requestKey !== requestKey;

  const retry = useCallback(() => {
    setRequestVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    getUsersRequest({ page, take, search }, { signal: controller.signal })
      .then(({ users, meta }) => {
        setState({
          users,
          meta: { ...EMPTY_META, ...meta },
          error: "",
          requestKey,
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        setState({
          users: [],
          meta: { ...EMPTY_META, page, take },
          error: error instanceof UsersRequestError
            ? error.message
            : "Something went wrong while loading users. Please try again.",
          requestKey,
        });
      });

    return () => controller.abort();
  }, [page, requestKey, search, take]);

  return {
    ...state,
    error: isLoading ? "" : state.error,
    isLoading,
    retry,
  };
};

export default useUsers;
