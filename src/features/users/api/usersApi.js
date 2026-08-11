import { apiFetch } from "../../../api/apiFetch";

const USERS_PATH = "/users";
const USERS_STATS_PATH = "/users/stats";

export class UsersRequestError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "UsersRequestError";
    this.status = status;
  }
}

export const getUsersRequest = async (
  { page = 1, role = "", take = 10, search = "", status = "" } = {},
  { signal } = {},
) => {
  const parameters = new URLSearchParams({
    page: String(page),
    take: String(take),
  });
  const normalizedSearch = search.trim();

  if (normalizedSearch) {
    parameters.set("search", normalizedSearch);
  }

  if (status) {
    parameters.set("status", status);
  }

  if (role) {
    parameters.set("role", role);
  }

  let response;

  try {
    response = await apiFetch(`${USERS_PATH}?${parameters.toString()}`, {
      method: "GET",
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new UsersRequestError(
      "We could not reach the LinCo server. Check your connection and try again.",
    );
  }

  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new UsersRequestError(
      "The users response could not be read. Please try again.",
      response.status,
    );
  }

  if (!response.ok || payload?.success === false) {
    throw new UsersRequestError(
      payload?.message || "Users could not be loaded. Please try again.",
      response.status,
    );
  }

  if (!Array.isArray(payload?.data) || !payload?.meta) {
    throw new UsersRequestError(
      "The users response was incomplete. Please try again.",
      response.status,
    );
  }

  return {
    users: payload.data,
    meta: payload.meta,
  };
};

export const getUserStatsRequest = async ({ signal } = {}) => {
  let response;

  try {
    response = await apiFetch(USERS_STATS_PATH, {
      method: "GET",
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new UsersRequestError(
      "We could not reach the LinCo server. Check your connection and try again.",
    );
  }

  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new UsersRequestError(
      "The user statistics response could not be read. Please try again.",
      response.status,
    );
  }

  if (!response.ok || payload?.success === false) {
    throw new UsersRequestError(
      payload?.message || "User statistics could not be loaded. Please try again.",
      response.status,
    );
  }

  const statFields = [
    "totalUsers",
    "verifiedAccounts",
    "newThisMonth",
    "twoFactorEnabled",
  ];

  if (
    !payload?.data
    || typeof payload.data !== "object"
    || statFields.some((field) => !Number.isFinite(payload.data[field]))
  ) {
    throw new UsersRequestError(
      "The user statistics response was incomplete. Please try again.",
      response.status,
    );
  }

  return payload.data;
};

const updateUserStatusRequest = async (path, method) => {
  let response;

  try {
    response = await apiFetch(path, { method });
  } catch {
    throw new UsersRequestError(
      "We could not reach the LinCo server. Check your connection and try again.",
    );
  }

  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new UsersRequestError(
      "The account update response could not be read. Please try again.",
      response.status,
    );
  }

  if (!response.ok || payload?.success !== true) {
    throw new UsersRequestError(
      payload?.message || "The user account could not be updated. Please try again.",
      response.status,
    );
  }

  return payload;
};

export const suspendUserRequest = (userId) => (
  updateUserStatusRequest(`${USERS_PATH}/${encodeURIComponent(userId)}`, "DELETE")
);

export const activateUserRequest = (userId) => (
  updateUserStatusRequest(`${USERS_PATH}/${encodeURIComponent(userId)}/activate`, "PATCH")
);
