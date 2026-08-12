import { useCallback, useState } from "react";
import {
  activateUserRequest,
  promoteUserToAdminRequest,
  suspendUserRequest,
  UsersRequestError,
} from "../api/usersApi";

const ACTIONS = {
  activate: {
    request: activateUserRequest,
    successMessage: (name) => `${name}'s account was reactivated.`,
  },
  promote: {
    request: promoteUserToAdminRequest,
    successMessage: (name) => `${name} is now an administrator.`,
  },
  suspend: {
    request: suspendUserRequest,
    successMessage: (name) => `${name}'s account was suspended.`,
  },
};

const useUserActions = () => {
  const [feedback, setFeedback] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const updateUser = useCallback(async ({ action, name, userId }) => {
    const actionConfig = ACTIONS[action];

    if (!actionConfig) {
      return false;
    }

    setFeedback(null);
    setPendingAction({ action, userId });

    try {
      await actionConfig.request(userId);

      setFeedback({
        message: actionConfig.successMessage(name),
        tone: "success",
      });
      return true;
    } catch (error) {
      setFeedback({
        message: error instanceof UsersRequestError
          ? error.message
          : "The user could not be updated. Please try again.",
        tone: "error",
      });
      return false;
    } finally {
      setPendingAction(null);
    }
  }, []);

  return {
    feedback,
    pendingAction,
    updateUser,
  };
};

export default useUserActions;
