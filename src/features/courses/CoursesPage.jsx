import { useEffect, useState } from "react";
import Icon from "../../components/icons/Icon";
import commonStyles from "../../components/common/Common.module.css";
import PageHeader, { ActionButton } from "../../components/common/PageHeader";
import { Pagination, TableTools } from "../../components/common/TableTools";
import adminStyles from "../../styles/AdminPages.module.css";
import styles from "./Courses.module.css";

import useCourses from "./hooks/useCourses";
import useCourseStats from "./hooks/useCourseStats";
import CourseDashboardCard from "./components/CourseDashboardCard";
import TagManagementModal from "./components/TagManagementModal";

const PAGE_SIZE = 12;

const CoursesPage = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { courses, error, isLoading, meta, retry } = useCourses({
    page,
    search,
    status,
    take: PAGE_SIZE,
  });

  const {
    stats,
    isLoading: statsLoading,
    error: statsError,
    retry: retryStats,
  } = useCourseStats();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const summaryValue = (value) =>
    statsLoading || statsError ? "—" : value.toLocaleString();

  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  return (
    <div className={adminStyles.page}>
      <PageHeader
        description="Moderate shared learning content and monitor course engagement throughout the marketplace."
        eyebrow="Learning administration"
        title="Course Library"
      >
        <ActionButton
          icon="external"
          variant="secondary"
          onClick={() => setIsTagModalOpen(true)}
        >
          Manage Tags
        </ActionButton>
        <ActionButton icon="download" variant="secondary">
          Export catalog
        </ActionButton>
      </PageHeader>

      <div className={styles.statsGrid}>
        <div className={adminStyles.summaryCard}>
          <span className={adminStyles.summaryIcon}>
            <Icon name="courses" size={20} />
          </span>
          <div>
            <strong>{summaryValue(stats.totalCourses)}</strong>
            <span>Total Courses</span>
          </div>
        </div>
        <div className={adminStyles.summaryCard}>
          <span className={adminStyles.summaryIcon}>
            <Icon name="check" size={20} />
          </span>
          <div>
            <strong>{summaryValue(stats.publishedCourses)}</strong>
            <span>Published</span>
          </div>
        </div>
        <div className={adminStyles.summaryCard}>
          <span className={adminStyles.summaryIcon}>
            <Icon name="clock" size={20} />
          </span>
          <div>
            <strong>{summaryValue(stats.draftCourses)}</strong>
            <span>Drafts</span>
          </div>
        </div>
        <div className={adminStyles.summaryCard}>
          <span className={adminStyles.summaryIcon}>
            <Icon name="users" size={20} />
          </span>
          <div>
            <strong>{summaryValue(stats.totalEnrollments)}</strong>
            <span>Enrollments</span>
          </div>
        </div>
        <div className={adminStyles.summaryCard}>
          <span className={adminStyles.summaryIcon}>
            <Icon name="globe" size={20} />
          </span>
          <div>
            <strong>{summaryValue(stats.publicCourses)}</strong>
            <span>Public Courses</span>
          </div>
        </div>
        <div className={adminStyles.summaryCard}>
          <span className={adminStyles.summaryIcon}>
            <Icon name="lock" size={20} />
          </span>
          <div>
            <strong>{summaryValue(stats.privateCourses)}</strong>
            <span>Private Courses</span>
          </div>
        </div>
      </div>

      {statsError && (
        <div className={adminStyles.statsError} role="alert">
          <span>{statsError}</span>
          <button onClick={retryStats} type="button">
            Try again
          </button>
        </div>
      )}

      <TableTools
        placeholder="Search title or description..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        showFilters={false}
      >
        <label className={commonStyles.filterField}>
          <span>Visibility</span>
          <select
            className={commonStyles.select}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            value={status}
          >
            <option value="">All Visibility</option>
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
        </label>
      </TableTools>

      <div className={styles.coursesGrid}>
        {isLoading ? (
          <div className={styles.stateBox}>Loading courses...</div>
        ) : error ? (
          <div className={styles.stateBox}>
            <span style={{ color: "red", marginBottom: "10px" }}>{error}</span>
            <button className={commonStyles.buttonSecondary} onClick={retry}>
              Retry
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className={styles.stateBox}>
            No courses found matching your criteria.
          </div>
        ) : (
          courses.map((course) => (
            <CourseDashboardCard key={course.id} course={course} />
          ))
        )}
      </div>

      {!isLoading && !error && courses.length > 0 && (
        <Pagination
          hasNextPage={meta.hasNextPage}
          hasPreviousPage={meta.hasPreviousPage}
          label={`Showing ${(meta.page - 1) * meta.take + 1}–${Math.min(meta.page * meta.take, meta.itemCount)} of ${meta.itemCount} courses`}
          onPageChange={setPage}
          page={meta.page}
          pageCount={meta.pageCount}
        />
      )}

      <TagManagementModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
      />
    </div>
  );
};

export default CoursesPage;
