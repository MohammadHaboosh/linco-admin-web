const REFRESH_TOKENS_PATH = "authentication/refresh-tokens";

export const AUTH_SESSION_EXPIRED_EVENT = "linco:auth-session-expired";

let refreshPromise = null;
let refreshVersion = 0;

const buildApiUrl = (path) => {
  const pathValue = String(path);

  if (/^https?:\/\//i.test(pathValue)) {
    return pathValue;
  }

  const baseUrl = (import.meta.env.VITE_API_BASE_URL || "")
    .trim()
    .replace(/\/+$/, "");
  const normalizedPath = pathValue.replace(/^\/+/, "");

  return `${baseUrl}/${normalizedPath}`;
};

const createHeaders = (providedHeaders, body) => {
  const headers = new Headers(providedHeaders);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (
    !headers.has("Content-Type")
    && !(typeof FormData !== "undefined" && body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("x-client-type", "web");

  return headers;
};

const executeRequest = (path, options = {}) => {
  const { body, headers, ...requestOptions } = options;

  return fetch(buildApiUrl(path), {
    ...requestOptions,
    body,
    credentials: "include",
    headers: createHeaders(headers, body),
  });
};

const notifySessionExpired = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
  }
};

const refreshAuthCookies = () => {
  if (!refreshPromise) {
    refreshPromise = executeRequest(REFRESH_TOKENS_PATH, {
      method: "POST",
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("The authentication session could not be refreshed.");
        }

        refreshVersion += 1;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const apiFetch = async (path, options = {}) => {
  const {
    skipAuthRefresh = false,
    ...requestOptions
  } = options;
  const requestRefreshVersion = refreshVersion;
  const response = await executeRequest(path, requestOptions);

  if (response.status !== 401 || skipAuthRefresh) {
    return response;
  }

  try {
    if (requestRefreshVersion === refreshVersion) {
      await refreshAuthCookies();
    }
  } catch {
    notifySessionExpired();
    return response;
  }

  const retryResponse = await executeRequest(path, requestOptions);

  if (retryResponse.status === 401) {
    notifySessionExpired();
  }

  return retryResponse;
};

export default apiFetch;
