import Icon from "../../../components/icons/Icon";
import StatusBadge from "../../../components/common/StatusBadge";
import styles from "../Courses.module.css";

const CourseDashboardCard = ({
  course,
  isUpdatingVisibility,
  onMakePrivate,
  onPreview,
}) => {
  const isPublished = course.isPublished;
  const isPublic = course.visibility === "PUBLIC";

  return (
    <div className={styles.courseCard}>
      <div className={styles.imageWrapper}>
        <img
          src={course.imagePath || "/images/placeholder-course.jpg"}
          alt={course.title}
          className={styles.courseImage}
        />
        <div className={styles.imageOverlay}></div>

        <div className={styles.badgeTopRight}>
          {course.price === 0 ? "Free" : `$${course.price}`}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.providerInfo}>
          <div className={styles.providerAvatar}>
            {course.demo?.imagePath ? (
              <img src={course.demo.imagePath} alt={course.demo?.name} />
            ) : (
              course.demo?.name?.charAt(0) || "D"
            )}
          </div>
          <span className={styles.providerName}>
            {course.demo?.name || "Unknown Provider"}
          </span>
        </div>

        <h3 className={styles.courseTitle} title={course.title}>
          {course.title}
        </h3>
        <p className={styles.courseDesc}>{course.description}</p>

        {course.tags && course.tags.length > 0 && (
          <div className={styles.tagsRow}>
            {course.tags.slice(0, 3).map((tag) => (
              <span key={tag.id} className={styles.tag}>
                {tag.name}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className={styles.tag}>+{course.tags.length - 3}</span>
            )}
          </div>
        )}

        <div className={styles.statusIndicators}>
          <StatusBadge tone={isPublished ? "success" : "neutral"}>
            {isPublished ? "Published" : "Draft"}
          </StatusBadge>
          <StatusBadge tone={isPublic ? "blue" : "warning"}>
            {isPublic ? "Public" : "Private"}
          </StatusBadge>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.courseMeta}>
          <span className={styles.metaItem} title="Total Sections">
            <Icon name="folder" size={14} /> {course.sectionsCount}
          </span>
          <span className={styles.metaItem} title="Total Lessons">
            <Icon name="courses" size={14} /> {course.lessonCount}
          </span>
          <span className={styles.metaItem} title="Duration (mins)">
            <Icon name="clock" size={14} /> {course.totalDuration}m
          </span>
        </div>
        <div className={styles.courseActions}>
          <button
            className={styles.previewButton}
            onClick={() => onPreview(course)}
            type="button"
          >
            <Icon name="eye" size={15} />
            Preview
          </button>
          {isPublic && (
            <button
              className={styles.privateButton}
              disabled={isUpdatingVisibility}
              onClick={() => onMakePrivate(course)}
              type="button"
            >
              <Icon name="lock" size={15} />
              {isUpdatingVisibility ? "Updating..." : "Make private"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDashboardCard;
