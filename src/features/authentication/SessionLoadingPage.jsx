import styles from "./Authentication.module.css";

const SessionLoadingPage = () => (
  <main
    aria-busy="true"
    aria-label="Checking your session"
    className={styles.sessionLoadingPage}
  >
    <div className={styles.sessionLoadingCard}>
      <img alt="" className={styles.sessionLoadingLogo} src="/linco-logo.png" />
      <span className={styles.sessionLoadingSpinner} aria-hidden="true" />
      <p>Checking your session...</p>
    </div>
  </main>
);

export default SessionLoadingPage;
