import { useState } from "react";
import Icon from "../../../components/icons/Icon";
import useSignIn from "../hooks/useSignIn";
import styles from "../Authentication.module.css";

const SignInForm = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    clearFieldError,
    fieldErrors,
    formError,
    isSubmitting,
    submit,
  } = useSignIn();

  const updateField = (event) => {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value,
    }));
    clearFieldError(name);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit(values);
  };

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      {formError && (
        <div className={styles.formAlert} role="alert">
          <Icon name="alert" size={18} />
          <span>{formError}</span>
        </div>
      )}

      <div className={styles.fieldGroup}>
        <label htmlFor="email">Email address</label>
        <div
          className={`${styles.inputWrap} ${fieldErrors.email ? styles.inputInvalid : ""}`}
        >
          <Icon name="mail" size={18} />
          <input
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            aria-invalid={Boolean(fieldErrors.email)}
            autoComplete="email"
            autoFocus
            id="email"
            inputMode="email"
            name="email"
            onChange={updateField}
            placeholder="admin@company.com"
            type="email"
            value={values.email}
          />
        </div>
        {fieldErrors.email && (
          <span className={styles.fieldError} id="email-error">
            {fieldErrors.email}
          </span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <div className={styles.labelRow}>
          <label htmlFor="password">Password</label>
          <span>Case-sensitive</span>
        </div>
        <div
          className={`${styles.inputWrap} ${fieldErrors.password ? styles.inputInvalid : ""}`}
        >
          <Icon name="lock" size={18} />
          <input
            aria-describedby={fieldErrors.password ? "password-error" : undefined}
            aria-invalid={Boolean(fieldErrors.password)}
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={updateField}
            placeholder="Enter your password"
            type={passwordVisible ? "text" : "password"}
            value={values.password}
          />
          <button
            aria-label={passwordVisible ? "Hide password" : "Show password"}
            className={styles.passwordToggle}
            onClick={() => setPasswordVisible((current) => !current)}
            type="button"
          >
            <Icon name={passwordVisible ? "eyeOff" : "eye"} size={18} />
          </button>
        </div>
        {fieldErrors.password && (
          <span className={styles.fieldError} id="password-error">
            {fieldErrors.password}
          </span>
        )}
      </div>

      <button className={styles.submitButton} disabled={isSubmitting} type="submit">
        {isSubmitting ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            Signing in...
          </>
        ) : (
          <>
            Sign in to LinCo
            <Icon name="arrowRight" size={18} />
          </>
        )}
      </button>
    </form>
  );
};

export default SignInForm;
