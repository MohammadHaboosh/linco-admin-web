import { useState } from "react";
import {
  AuthenticationError,
  signInRequest,
} from "../api/authenticationApi";
import { setAuthSession } from "../store/authStore";
import { validateSignIn } from "../utils/authValidation";

const useSignIn = () => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearFieldError = (fieldName) => {
    setFieldErrors((current) => {
      if (!current[fieldName]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[fieldName];
      return nextErrors;
    });
    setFormError("");
  };

  const submit = async ({ email, password }) => {
    const validationErrors = validateSignIn({ email, password });

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setFormError("");
      return false;
    }

    setFieldErrors({});
    setFormError("");
    setIsSubmitting(true);

    try {
      const authData = await signInRequest({
        email: email.trim(),
        password,
      });

      if (authData.requires2FA) {
        setFormError(
          "Two-factor verification is required for this account. The verification step still needs to be connected.",
        );
        return false;
      }

      setAuthSession(authData);
      return true;
    } catch (error) {
      setFormError(
        error instanceof AuthenticationError
          ? error.message
          : "Something went wrong while signing in. Please try again.",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    clearFieldError,
    fieldErrors,
    formError,
    isSubmitting,
    submit,
  };
};

export default useSignIn;
