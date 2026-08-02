import styles from "./Common.module.css";

const Panel = ({ title, subtitle, action, children, className = "" }) => (
  <section className={`${styles.panel} ${className}`}>
    {(title || action) && (
      <header className={styles.panelHeader}>
        <div>
          {title && <h2 className={styles.panelTitle}>{title}</h2>}
          {subtitle && <p className={styles.panelSubtitle}>{subtitle}</p>}
        </div>
        {action}
      </header>
    )}
    <div className={styles.panelBody}>{children}</div>
  </section>
);

export default Panel;
