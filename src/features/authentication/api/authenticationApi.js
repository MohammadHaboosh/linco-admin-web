import { apiFetch } from "../../../api/apiFetch";

const SIGN_IN_PATH = "authentication/sign-in";
const CURRENT_USER_PATH = "/users/me";

const readResponseBody = async (response) => {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return null;
  }
};

export class AuthenticationError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "AuthenticationError";
    this.status = status;
  }
}

export const signInRequest = async ({ email, password }, { signal } = {}) => {
  let response;

  try {
    response = await apiFetch(SIGN_IN_PATH, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      signal,
      skipAuthRefresh: true,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new AuthenticationError(
      "We could not reach the LinCo server. Check your connection and try again.",
    );
  }

  const payload = await readResponseBody(response);

  if (!response.ok || payload?.success === false) {
    throw new AuthenticationError(
      payload?.message || "The email or password you entered is incorrect.",
      response.status,
    );
  }

  const authData = payload?.data;

  if (!authData || typeof authData.requires2FA !== "boolean") {
    throw new AuthenticationError(
      "The sign-in response was incomplete. Please try again.",
      response.status,
    );
  }

  if (!authData.requires2FA && !authData.user) {
    throw new AuthenticationError(
      "The sign-in response did not include the signed-in user.",
      response.status,
    );
  }

  return authData;
};

export const getCurrentUserRequest = async ({ signal } = {}) => {
  let response;

  try {
    response = await apiFetch(CURRENT_USER_PATH, {
      method: "GET",
      cache: "no-store",
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new AuthenticationError(
      "We could not verify your session. Check your connection and try again.",
    );
  }

  const payload = await readResponseBody(response);

  if (!response.ok || payload?.success === false) {
    throw new AuthenticationError(
      payload?.message || "Your session could not be verified.",
      response.status,
    );
  }

  if (!payload?.data?.user || typeof payload.data.user !== "object") {
    throw new AuthenticationError(
      "The current session response did not include a user.",
      response.status,
    );
  }

  return payload.data.user;
};
