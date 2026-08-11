import Icon from "../icons/Icon";
import styles from "./Common.module.css";

export const TableTools = ({
  children,
  onSearchChange,
  placeholder,
  searchValue,
  showFilters = true,
  statusLabel = "All statuses",
}) => (
  <div className={styles.toolbar}>
    <label className={styles.searchField}>
      <Icon name="search" size={17} />
      <input
        aria-label={placeholder}
        className={styles.searchInput}
        onChange={(event) => onSearchChange?.(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={searchValue}
      />
    </label>
    {children ? (
      <div className={styles.toolbarGroup}>{children}</div>
    ) : showFilters && (
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
    )}
  </div>
);

const getVisiblePages = (page, pageCount) => {
  const visibleCount = Math.min(pageCount, 5);
  const start = Math.max(1, Math.min(page - 2, pageCount - visibleCount + 1));

  return Array.from({ length: visibleCount }, (_, index) => start + index);
};

export const Pagination = ({
  hasNextPage,
  hasPreviousPage,
  label = "Showing 1–6 of 128 results",
  onPageChange,
  page = 1,
  pageCount = 3,
}) => {
  if (!onPageChange) {
    return (
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
  }

  const visiblePages = getVisiblePages(page, pageCount);
  const canGoBack = hasPreviousPage ?? page > 1;
  const canGoForward = hasNextPage ?? page < pageCount;

  return (
    <div className={styles.pagination}>
      <span>{label}</span>
      {pageCount > 1 && (
        <div className={styles.pageNumbers}>
          <button
            aria-label="Previous page"
            className={styles.pageNumber}
            disabled={!canGoBack}
            onClick={() => onPageChange(page - 1)}
            type="button"
          >
            <Icon className={styles.chevronLeft} name="chevronRight" size={15} />
          </button>
          {visiblePages.map((pageNumber) => (
            <button
              aria-current={pageNumber === page ? "page" : undefined}
              className={`${styles.pageNumber} ${pageNumber === page ? styles.pageNumberActive : ""}`}
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              type="button"
            >
              {pageNumber}
            </button>
          ))}
          <button
            aria-label="Next page"
            className={styles.pageNumber}
            disabled={!canGoForward}
            onClick={() => onPageChange(page + 1)}
            type="button"
          >
            <Icon name="chevronRight" size={15} />
          </button>
        </div>
      )}
    </div>
  );
};
