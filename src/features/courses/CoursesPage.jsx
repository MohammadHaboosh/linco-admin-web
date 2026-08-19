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
import CoursePreviewModal from "./components/CoursePreviewModal";
import TagManagementModal from "./components/TagManagementModal";
import { setCourseVisibilityRequest } from "./api/coursesApi";

const PAGE_SIZE = 12;

const CoursesPage = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [previewCourse, setPreviewCourse] = useState(null);
  const [privacyCourse, setPrivacyCourse] = useState(null);
  const [updatingCourseId, setUpdatingCourseId] = useState(null);
  const [feedback, setFeedback] = useState(null);

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

  useEffect(() => {
    if (!privacyCourse) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !updatingCourseId) {
        setPrivacyCourse(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [privacyCourse, updatingCourseId]);

  const summaryValue = (value) =>
    statsLoading || statsError ? "—" : value.toLocaleString();

  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const makeCoursePrivate = async () => {
    if (!privacyCourse || updatingCourseId) return;

    const course = privacyCourse;
    setUpdatingCourseId(course.id);
    setFeedback(null);

    try {
      await setCourseVisibilityRequest(course.id, "PRIVATE");
      setPrivacyCourse(null);
      setFeedback({
        tone: "success",
        message: `“${course.title}” is now private and no longer appears in the public library.`,
      });
      retry();
      retryStats();
    } catch (requestError) {
      setPrivacyCourse(null);
      setFeedback({
        tone: "error",
        message:
          requestError.message || "Failed to make the course private.",
      });
    } finally {
      setUpdatingCourseId(null);
    }
  };

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

      {feedback && (
        <div
          className={styles.feedbackBanner}
          data-tone={feedback.tone}
          role={feedback.tone === "error" ? "alert" : "status"}
        >
          <Icon
            name={feedback.tone === "error" ? "alert" : "check"}
            size={18}
          />
          <span>{feedback.message}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => setFeedback(null)}
            type="button"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

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
            <span className={styles.pageError}>{error}</span>
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
            <CourseDashboardCard
              course={course}
              isUpdatingVisibility={updatingCourseId === course.id}
              key={course.id}
              onMakePrivate={setPrivacyCourse}
              onPreview={setPreviewCourse}
            />
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

      {previewCourse && (
        <CoursePreviewModal
          course={previewCourse}
          onClose={() => setPreviewCourse(null)}
        />
      )}

      {privacyCourse && (
        <div
          className={styles.confirmationOverlay}
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !updatingCourseId
            ) {
              setPrivacyCourse(null);
            }
          }}
          role="presentation"
        >
          <section
            aria-describedby="privacy-confirmation-description"
            aria-labelledby="privacy-confirmation-title"
            aria-modal="true"
            className={styles.confirmationDialog}
            role="dialog"
          >
            <div className={styles.confirmationIcon}>
              <Icon name="lock" size={24} />
            </div>
            <h2 id="privacy-confirmation-title">Make this course private?</h2>
            <p id="privacy-confirmation-description">
              <strong>{privacyCourse.title}</strong> will be removed from the
              public library. The course and its existing content will not be
              deleted.
            </p>
            <div className={styles.confirmationActions}>
              <button
                className={commonStyles.buttonSecondary}
                disabled={Boolean(updatingCourseId)}
                onClick={() => setPrivacyCourse(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className={styles.confirmPrivateButton}
                disabled={Boolean(updatingCourseId)}
                onClick={makeCoursePrivate}
                type="button"
              >
                <Icon name="lock" size={16} />
                {updatingCourseId ? "Making private..." : "Make private"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
