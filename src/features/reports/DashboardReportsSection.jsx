import Panel from "../../components/common/Panel";
import styles from "../../styles/AdminPages.module.css";
import useDashboardReports from "./hooks/useDashboardReports";

const numberFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
});

const percentageFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
});

const monthFormatter = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});

const formatNumber = (value) => numberFormatter.format(value);
const formatPercentage = (value) => `${percentageFormatter.format(value)}%`;

const formatEnum = (value) => (
  value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
);

const formatMonth = (value) => monthFormatter.format(new Date(value));

const pluralize = (value, singular, plural = `${singular}s`) => (
  Number(value) === 1 ? singular : plural
);

const LearningEngagement = ({ engagement }) => {
  const maximum = Math.max(
    1,
    ...engagement.points.flatMap((point) => [
      point.activeLearners,
      point.completedLearningPaths,
    ]),
  );

  return (
    <>
      <div className={styles.chartLegend} aria-label="Chart legend">
        <span><i data-series="active" />Active learners</span>
        <span><i data-series="completed" />Completed learning paths</span>
      </div>
      <div
        aria-label={`Learning engagement for ${formatEnum(engagement.period)}`}
        className={styles.barChart}
        role="img"
      >
        {engagement.points.map((point) => {
          const activeHeight = (Math.max(0, point.activeLearners) / maximum) * 100;
          const completionHeight = (Math.max(0, point.completedLearningPaths) / maximum) * 100;

          return (
            <div className={styles.barGroup} key={point.date}>
              <span
                aria-label={`${point.label}: ${formatNumber(point.activeLearners)} active learners`}
                className={styles.bar}
                role="img"
                style={{ height: `${activeHeight}%` }}
                title={`${formatMonth(point.date)}: ${formatNumber(point.activeLearners)} active learners`}
              />
              <span
                aria-label={`${point.label}: ${formatNumber(point.completedLearningPaths)} completed learning paths`}
                className={`${styles.bar} ${styles.barSecondary}`}
                role="img"
                style={{ height: `${completionHeight}%` }}
                title={`${formatMonth(point.date)}: ${formatNumber(point.completedLearningPaths)} completed learning paths`}
              />
            </div>
          );
        })}
      </div>
      <div className={styles.barLabels}>
        {engagement.points.map((point) => (
          <span key={point.date} title={formatMonth(point.date)}>
            <strong>{point.label}</strong>
            <small>{formatNumber(point.activeLearners)} / {formatNumber(point.completedLearningPaths)}</small>
          </span>
        ))}
      </div>
    </>
  );
};

const getHealthItems = (health) => {
  const availabilityMeasured = health.apiAvailability.measured
    && health.apiAvailability.value !== null;

  return [
    {
      detail: availabilityMeasured
        ? "Availability measured during this period"
        : "No availability measurement for this period",
      key: "apiAvailability",
      label: "API availability",
      measured: availabilityMeasured,
      value: health.apiAvailability.value,
    },
    {
      detail: `${formatNumber(health.courseCompletion.completedAssignments)} of ${formatNumber(health.courseCompletion.totalAssignments)} ${pluralize(health.courseCompletion.totalAssignments, "assignment")} completed`,
      key: "courseCompletion",
      label: "Course completion",
      measured: true,
      value: health.courseCompletion.value,
    },
    {
      detail: `${formatNumber(health.workspaceActivation.activatedWorkspaces)} of ${formatNumber(health.workspaceActivation.totalWorkspaces)} ${pluralize(health.workspaceActivation.totalWorkspaces, "workspace")} activated`,
      key: "workspaceActivation",
      label: "Workspace activation",
      measured: true,
      value: health.workspaceActivation.value,
    },
    {
      detail: `${formatNumber(health.supportResponseSla.responsesWithinSla)} of ${formatNumber(health.supportResponseSla.totalInquiries)} ${pluralize(health.supportResponseSla.totalInquiries, "inquiry", "inquiries")} answered within ${formatNumber(health.supportResponseSla.targetHours)} hours`,
      key: "supportResponseSla",
      label: "Support response SLA",
      measured: true,
      value: health.supportResponseSla.value,
    },
  ];
};

const PlatformHealth = ({ health }) => (
  <div className={styles.healthList}>
    {getHealthItems(health).map((item) => {
      const progress = item.measured ? Math.min(100, Math.max(0, item.value)) : 0;

      return (
        <div key={item.key}>
          <div className={styles.healthRowHeader}>
            <span>{item.label}</span>
            <strong>{item.measured ? formatPercentage(item.value) : "Not measured"}</strong>
          </div>
          <div
            aria-label={`${item.label}: ${item.measured ? formatPercentage(item.value) : "not measured"}`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={item.measured ? progress : undefined}
            aria-valuetext={item.measured ? formatPercentage(item.value) : "Not measured"}
            className={styles.progressTrack}
            role="progressbar"
          >
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <small className={styles.healthDetail}>{item.detail}</small>
        </div>
      );
    })}
  </div>
);

const DashboardReportsSection = () => {
  const { error, isLoading, reports, retry } = useDashboardReports();

  return (
    <section aria-label="Platform reports" className={styles.overviewReports}>
      {isLoading ? (
        <div className={styles.dashboardState} role="status">Loading reports...</div>
      ) : error ? (
        <div className={styles.dashboardState} role="alert">
          <strong>Reports could not be loaded</strong>
          <span>{error}</span>
          <button onClick={retry} type="button">Try again</button>
        </div>
      ) : reports && (
        <div className={styles.reportGrid}>
          <Panel
            action={<span className={styles.periodBadge}>{formatEnum(reports.learningEngagement.period)}</span>}
            subtitle="Active learners compared with completed learning paths"
            title="Learning engagement"
          >
            <LearningEngagement engagement={reports.learningEngagement} />
          </Panel>

          <Panel
            action={<span className={styles.periodBadge}>{formatEnum(reports.platformHealth.period)}</span>}
            subtitle={`Operational targets from ${formatMonth(reports.platformHealth.periodStart)}`}
            title="Platform health"
          >
            <PlatformHealth health={reports.platformHealth} />
          </Panel>
        </div>
      )}
    </section>
  );
};

export default DashboardReportsSection;
