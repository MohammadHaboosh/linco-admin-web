import Icon from "../icons/Icon";
import styles from "./Common.module.css";

export const ActionButton = ({ children, icon, variant = "primary", onClick }) => (
  <button
    className={`${styles.button} ${variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary}`}
    onClick={onClick}
    type="button"
  >
    {icon && <Icon name={icon} size={17} />}
    {children}
  </button>
);

const PageHeader = ({ eyebrow = "LinCo administration", title, description, children }) => (
  <header className={styles.pageHeader}>
    <div>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h1 className={styles.pageTitle}>{title}</h1>
      <p className={styles.pageDescription}>{description}</p>
    </div>
    {children && <div className={styles.headerActions}>{children}</div>}
  </header>
);

export default PageHeader;
