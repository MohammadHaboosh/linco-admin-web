import { useSyncExternalStore } from "react";
import {
  clearAuthSession,
  getAuthSnapshot,
  getServerAuthSnapshot,
  subscribeToAuthStore,
} from "../store/authStore";

const useAuthSession = () => {
  const session = useSyncExternalStore(
    subscribeToAuthStore,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );

  return {
    session,
    user: session?.user || null,
    isAuthenticated: Boolean(session?.user),
    signOut: clearAuthSession,
  };
};

export default useAuthSession;
