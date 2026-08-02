import Icon from "../icons/Icon";
import styles from "./Common.module.css";

export const TableTools = ({ placeholder, statusLabel = "All statuses" }) => (
  <div className={styles.toolbar}>
    <label className={styles.searchField}>
      <Icon name="search" size={17} />
      <input className={styles.searchInput} placeholder={placeholder} type="search" />
    </label>
    <div className={styles.toolbarGroup}>
      <select aria-label="Filter by status" className={styles.select} defaultValue="all">
        <option value="all">{statusLabel}</option>
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="suspended">Suspended</option>
      </select>
      <button className={styles.iconButton} title="More filters" type="button">
        <Icon name="filter" size={18} />
      </button>
    </div>
  </div>
);

export const Pagination = ({ label = "Showing 1–6 of 128 results" }) => (
  <div className={styles.pagination}>
    <span>{label}</span>
    <div className={styles.pageNumbers}>
      <button className={`${styles.pageNumber} ${styles.pageNumberActive}`} type="button">1</button>
      <button className={styles.pageNumber} type="button">2</button>
      <button className={styles.pageNumber} type="button">3</button>
      <button className={styles.pageNumber} type="button"><Icon name="chevronRight" size={15} /></button>
    </div>
  </div>
);
