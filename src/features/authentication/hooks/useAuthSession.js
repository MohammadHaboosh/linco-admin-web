import { useEffect, useSyncExternalStore } from "react";
import { getCurrentUserRequest } from "../api/authenticationApi";
import {
  clearAuthSession,
  getAuthSnapshot,
  getServerAuthSnapshot,
  setAuthSession,
  subscribeToAuthStore,
} from "../store/authStore";

const isAdminUser = (user) => user?.role?.trim().toUpperCase() === "ADMIN";

const useAuthSession = () => {
  const session = useSyncExternalStore(
    subscribeToAuthStore,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );

  useEffect(() => {
    if (getAuthSnapshot() !== undefined) {
      return undefined;
    }

    const controller = new AbortController();

    getCurrentUserRequest({ signal: controller.signal })
      .then((user) => {
        if (!isAdminUser(user)) {
          clearAuthSession();
          return;
        }

        setAuthSession({ user });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          clearAuthSession();
        }
      });

    return () => controller.abort();
  }, []);

  return {
    session,
    user: session?.user || null,
    isInitializing: session === undefined,
    isAuthenticated: Boolean(session?.user),
    signOut: clearAuthSession,
  };
};

export default useAuthSession;
