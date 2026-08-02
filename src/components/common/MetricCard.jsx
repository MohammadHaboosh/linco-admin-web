import Icon from "../icons/Icon";
import styles from "./Common.module.css";

const MetricCard = ({ icon, iconTone = "blue", label, value, trend, trendDirection = "up" }) => (
  <article className={styles.metricCard}>
    <div className={styles.metricTop}>
      <span className={styles.metricIcon} data-tone={iconTone}>
        <Icon name={icon} size={21} />
      </span>
      <span className={styles.metricTrend} data-direction={trendDirection}>
        <Icon name={trendDirection === "down" ? "arrowDown" : "arrowUp"} size={12} strokeWidth={2.4} />
        {trend}
      </span>
    </div>
    <p className={styles.metricValue}>{value}</p>
    <p className={styles.metricLabel}>{label}</p>
  </article>
);

export default MetricCard;
