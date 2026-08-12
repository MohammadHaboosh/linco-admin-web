import { useCallback, useEffect, useState } from "react";
import {
  CompaniesRequestError,
  getCompaniesRequest,
} from "../api/companiesApi";

const EMPTY_META = {
  page: 1,
  take: 10,
  itemCount: 0,
  pageCount: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

const useCompanies = ({ page, search, status, take }) => {
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState({
    companies: [],
    error: "",
    meta: { ...EMPTY_META, page, take },
    requestKey: "",
  });
  const requestKey = `${page}:${take}:${search}:${status}:${requestVersion}`;
  const isLoading = state.requestKey !== requestKey;

  const retry = useCallback(() => {
    setRequestVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    getCompaniesRequest(
      { page, search, status, take },
      { signal: controller.signal },
    )
      .then(({ companies, meta }) => {
        setState({
          companies,
          error: "",
          meta: { ...EMPTY_META, ...meta },
          requestKey,
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        setState({
          companies: [],
          error: error instanceof CompaniesRequestError
            ? error.message
            : "Something went wrong while loading companies. Please try again.",
          meta: { ...EMPTY_META, page, take },
          requestKey,
        });
      });

    return () => controller.abort();
  }, [page, requestKey, search, status, take]);

  return {
    ...state,
    error: isLoading ? "" : state.error,
    isLoading,
    retry,
  };
};

export default useCompanies;
