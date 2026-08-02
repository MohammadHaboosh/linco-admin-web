import styles from "./Common.module.css";

const StatusBadge = ({ children, tone = "neutral" }) => (
  <span className={styles.status} data-tone={tone}>
    {children}
  </span>
);

export default StatusBadge;
