import Icon from "../../components/icons/Icon";
import commonStyles from "../../components/common/Common.module.css";
import PageHeader, { ActionButton } from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { Pagination, TableTools } from "../../components/common/TableTools";
import { courses } from "../../data/mockData";
import styles from "../../styles/AdminPages.module.css";

const statusTone = (status) => status === "Published" ? "success" : status === "Review" ? "warning" : "neutral";

const CoursesPage = () => (
  <div className={styles.page}>
    <PageHeader
      description="Moderate shared learning content and monitor course engagement throughout the marketplace."
      eyebrow="Learning administration"
      title="Course library"
    >
      <ActionButton icon="download" variant="secondary">Export catalog</ActionButton>
      <ActionButton icon="plus">Create course</ActionButton>
    </PageHeader>

    <div className={styles.summaryStrip}>
      <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="courses" size={20} /></span><div><strong>412</strong><span>Published courses</span></div></div>
      <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="clock" size={20} /></span><div><strong>18</strong><span>Waiting for review</span></div></div>
      <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="users" size={20} /></span><div><strong>4,408</strong><span>Course enrollments</span></div></div>
    </div>

    <TableTools placeholder="Search title, category or creator..." statusLabel="All publishing states" />
    <div className={commonStyles.tableWrap}>
      <table className={commonStyles.table}>
        <thead><tr><th>Course</th><th>Creator</th><th>Learners</th><th>Completion</th><th>Rating</th><th>Status</th><th aria-label="Actions" /></tr></thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className={styles.courseTitleCell}><div className={commonStyles.entity}><span className={styles.courseCode}>{course.code}</span><div><p className={commonStyles.entityName}>{course.title}</p><p className={commonStyles.entityMeta}>{course.category}</p></div></div></td>
              <td>{course.creator}</td>
              <td>{course.learners.toLocaleString()}</td>
              <td className={styles.progressCell}><div className={styles.progressMeta}><span>Progress</span><strong>{course.completion}%</strong></div><div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: `${course.completion}%` }} /></div></td>
              <td>★ {course.rating}</td>
              <td><StatusBadge tone={statusTone(course.status)}>{course.status}</StatusBadge></td>
              <td><button className={commonStyles.iconButton} title={`Open actions for ${course.title}`} type="button"><Icon name="more" size={18} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Pagination label="Showing 1–6 of 438 courses" />
  </div>
);

export default CoursesPage;
