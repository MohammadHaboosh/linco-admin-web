import { useCallback, useState } from "react";
import {
  activateUserRequest,
  suspendUserRequest,
  UsersRequestError,
} from "../api/usersApi";

const useUserAccountAction = () => {
  const [feedback, setFeedback] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const updateAccount = useCallback(async ({ action, name, userId }) => {
    setFeedback(null);
    setUpdatingUserId(userId);

    try {
      if (action === "suspend") {
        await suspendUserRequest(userId);
      } else {
        await activateUserRequest(userId);
      }

      setFeedback({
        message: `${name}'s account was ${action === "suspend" ? "suspended" : "reactivated"}.`,
        tone: "success",
      });
      return true;
    } catch (error) {
      setFeedback({
        message: error instanceof UsersRequestError
          ? error.message
          : "The user account could not be updated. Please try again.",
        tone: "error",
      });
      return false;
    } finally {
      setUpdatingUserId(null);
    }
  }, []);

  return {
    feedback,
    updateAccount,
    updatingUserId,
  };
};

export default useUserAccountAction;
