import Icon from "../../components/icons/Icon";
import SignInForm from "./components/SignInForm";
import styles from "./Authentication.module.css";

const benefits = [
  {
    icon: "companies",
    title: "Manage every workspace",
    detail: "Review companies, users, and learning activity from one place.",
  },
  {
    icon: "reports",
    title: "See the platform clearly",
    detail: "Keep adoption, completion, and operational health in view.",
  },
  {
    icon: "audit",
    title: "Operate with confidence",
    detail: "Security controls and audit history stay close at hand.",
  },
];

const Brand = ({ compact = false }) => (
  <div className={`${styles.brand} ${compact ? styles.brandCompact : ""}`}>
    <span className={styles.brandMark}>
      <img alt="LinCo mascot" src="/linco-logo.png" />
    </span>
    <span>
      <strong>LinCo<span>.</span></strong>
      <small>Platform control</small>
    </span>
  </div>
);

const SignInPage = () => (
  <main className={styles.page}>
    <section className={styles.brandPanel}>
      <div className={styles.brandPanelInner}>
        <Brand />

        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Administration workspace</span>
          <h1>One platform.<br />Every learning workspace.</h1>
          <p>
            Keep LinCo companies, learners, content, and platform health moving
            in the right direction.
          </p>
        </div>

        <div className={styles.benefitList}>
          {benefits.map((benefit) => (
            <div className={styles.benefit} key={benefit.title}>
              <span><Icon name={benefit.icon} size={18} /></span>
              <div>
                <strong>{benefit.title}</strong>
                <p>{benefit.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.trustNote}>
          <Icon name="shield" size={17} />
          Secure access for authorized LinCo administrators
        </div>
      </div>
    </section>

    <section className={styles.formPanel}>
      <div className={styles.mobileBrand}><Brand compact /></div>
      <div className={styles.formContainer}>
        <div className={styles.formHeading}>
          <span className={styles.welcomeIcon}><Icon name="sparkles" size={18} /></span>
          <p>Welcome back</p>
          <h2>Sign in to your account</h2>
          <span>Enter your administrator credentials to continue.</span>
        </div>

        <SignInForm />

        <div className={styles.securityNote}>
          <Icon name="lock" size={15} />
          Your session is protected with secure, cookie-based authentication.
        </div>
      </div>
      <p className={styles.copyright}>© 2026 LinCo. Platform administration.</p>
    </section>
  </main>
);

export default SignInPage;
