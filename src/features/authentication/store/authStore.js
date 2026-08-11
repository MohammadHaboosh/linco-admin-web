import { AUTH_SESSION_EXPIRED_EVENT } from "../../../api/apiFetch";

// `undefined` means the cookie-backed session has not been checked yet.
// `null` means the check completed and there is no authenticated session.
let currentSession;
const listeners = new Set();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

export const getAuthSnapshot = () => currentSession;

export const getServerAuthSnapshot = () => undefined;

export const subscribeToAuthStore = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setAuthSession = (authData) => {
  currentSession = {
    user: authData.user,
    authenticatedAt: new Date().toISOString(),
  };
  emitChange();
};

export const clearAuthSession = () => {
  currentSession = null;
  emitChange();
};

if (typeof window !== "undefined") {
  window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, clearAuthSession);
}
