import { AUTH_SESSION_EXPIRED_EVENT } from "../../../api/apiFetch";

let currentSession = null;
const listeners = new Set();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

export const getAuthSnapshot = () => currentSession;

export const getServerAuthSnapshot = () => null;

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
