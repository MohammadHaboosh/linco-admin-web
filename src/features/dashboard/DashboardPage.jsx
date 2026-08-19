import MetricCard from "../../components/common/MetricCard";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import commonStyles from "../../components/common/Common.module.css";
import styles from "../../styles/AdminPages.module.css";
import useDashboardAnalytics from "./hooks/useDashboardAnalytics";

const numberFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  year: "numeric",
});

const roleDetails = {
  TRAINEES: { color: "var(--linco-blue-600)", label: "Trainees" },
  MANAGERS: { color: "var(--linco-sky-400)", label: "Managers" },
  OWNERS: { color: "var(--linco-violet)", label: "Owners" },
  OTHER_ROLES: { color: "var(--linco-blue-100)", label: "Other roles" },
};

const fallbackColors = [
  "var(--linco-blue-600)",
  "var(--linco-sky-400)",
  "var(--linco-violet)",
  "var(--linco-blue-100)",
];

const formatNumber = (value) => numberFormatter.format(value);

const formatChange = (value) => `${formatNumber(Math.abs(value))}%`;

const getTrendDirection = (value) => {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "neutral";
};

const formatRole = (role) => (
  roleDetails[role]?.label
  || role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
);

const formatPointDate = (dateValue) => dateFormatter.format(new Date(dateValue));

const createChartGeometry = (points) => {
  const left = 10;
  const right = 690;
  const top = 35;
  const bottom = 205;
  const maximum = Math.max(1, ...points.map((point) => point.value));
  const horizontalStep = points.length > 1 ? (right - left) / (points.length - 1) : 0;
  const coordinates = points.map((point, index) => ({
    point,
    x: points.length === 1 ? (left + right) / 2 : left + (horizontalStep * index),
    y: bottom - ((Math.max(0, point.value) / maximum) * (bottom - top)),
  }));
  const linePath = coordinates
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  const areaPath = coordinates.length > 0
    ? `${linePath} L${coordinates.at(-1).x.toFixed(2)} 222 L${coordinates[0].x.toFixed(2)} 222 Z`
    : "";

  return { areaPath, coordinates, linePath };
};

const GrowthChart = ({ growth }) => {
  const { areaPath, coordinates, linePath } = createChartGeometry(growth.points);
  const accessibleSummary = growth.points
    .map((point) => `${point.label}: ${formatNumber(point.value)}`)
    .join(", ");

  return (
    <>
      <div className={styles.chartSummary}>
        <strong>{formatNumber(growth.total)}</strong>
        <span data-direction={getTrendDirection(growth.changePercentage)}>
          {growth.changePercentage > 0 ? "+" : growth.changePercentage < 0 ? "−" : ""}
          {formatChange(growth.changePercentage)} this period
        </span>
      </div>
      <svg
        aria-label={`Active learner growth. ${accessibleSummary}`}
        className={styles.lineChart}
        role="img"
        viewBox="0 0 700 230"
      >
        <defs>
          <linearGradient id="growthFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--linco-blue-600)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--linco-blue-600)" stopOpacity="0" />
          </linearGradient>
          <filter id="pointShadow" x="-100%" y="-100%" width="300%" height="300%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="var(--linco-blue-600)" floodOpacity="0.25" />
          </filter>
        </defs>
        {[35, 77.5, 120, 162.5, 205].map((y) => (
          <line key={y} x1="8" x2="692" y1={y} y2={y} stroke="var(--linco-chart-grid)" strokeDasharray="4 5" />
        ))}
        {areaPath && <path d={areaPath} fill="url(#growthFill)" />}
        {linePath && (
          <path d={linePath} fill="none" stroke="var(--linco-blue-600)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        )}
        {coordinates.map(({ point, x, y }) => (
          <circle
            cx={x}
            cy={y}
            fill="var(--linco-surface)"
            filter="url(#pointShadow)"
            key={`${point.date}-${point.label}`}
            r="5"
            stroke="var(--linco-blue-600)"
            strokeWidth="3"
          >
            <title>{`${formatPointDate(point.date)}: ${formatNumber(point.value)} active learners`}</title>
          </circle>
        ))}
      </svg>
      <div className={styles.chartLabels}>
        {growth.points.map((point) => (
          <span key={point.date} title={formatPointDate(point.date)}>
            <strong>{point.label}</strong>
            <small>{formatNumber(point.value)}</small>
          </span>
        ))}
      </div>
    </>
  );
};

const getDistributionItemDetails = (item, index) => ({
  color: roleDetails[item.role]?.color || fallbackColors[index % fallbackColors.length],
  label: formatRole(item.role),
});

const createDonutBackground = (items) => {
  let cursor = 0;
  const segments = items
    .filter((item) => item.percentage > 0)
    .map((item, index) => {
      const start = cursor;
      cursor = Math.min(100, cursor + item.percentage);
      const { color } = getDistributionItemDetails(item, index);
      return `${color} ${start}% ${cursor}%`;
    });

  if (cursor < 100) {
    segments.push(`var(--linco-chart-track) ${cursor}% 100%`);
  }

  return `conic-gradient(${segments.join(", ")})`;
};

const UserDistribution = ({ distribution }) => (
  <>
    <div className={styles.donutWrap}>
      <div
        aria-label={`${formatNumber(distribution.total)} total users`}
        className={styles.donut}
        role="img"
        style={{ background: createDonutBackground(distribution.items) }}
      >
        <div className={styles.donutLabel}>
          <strong>{formatNumber(distribution.total)}</strong>
          <span>Total users</span>
        </div>
      </div>
    </div>
    <div className={styles.legend}>
      {distribution.items.map((item, index) => {
        const details = getDistributionItemDetails(item, index);

        return (
          <div className={styles.legendItem} key={item.role} style={{ "--legend-color": details.color }}>
            <i />
            <span>{details.label}</span>
            <strong>{formatNumber(item.count)} · {formatNumber(item.percentage)}%</strong>
          </div>
        );
      })}
    </div>
  </>
);

const DashboardPage = () => {
  const { analytics, error, isLoading, retry } = useDashboardAnalytics();

  return (
    <div className={styles.page}>
      <PageHeader
        description="A clear view of company growth, learner activity, and the health of the LinCo platform."
        title="Platform overview"
      />

      {isLoading ? (
        <div className={styles.dashboardState} role="status">Loading dashboard analytics...</div>
      ) : error ? (
        <div className={styles.dashboardState} role="alert">
          <strong>Dashboard analytics could not be loaded</strong>
          <span>{error}</span>
          <button onClick={retry} type="button">Try again</button>
        </div>
      ) : analytics && (
        <>
          <div className={`${commonStyles.metricsGrid} ${styles.metricsSpacing}`}>
            <MetricCard
              icon="companies"
              iconTone="blue"
              label="Registered companies"
              trend={formatChange(analytics.summary.registeredCompanies.changePercentage)}
              trendDirection={getTrendDirection(analytics.summary.registeredCompanies.changePercentage)}
              value={formatNumber(analytics.summary.registeredCompanies.value)}
            />
            <MetricCard
              icon="users"
              iconTone="sky"
              label="Active learners"
              trend={formatChange(analytics.summary.activeLearners.changePercentage)}
              trendDirection={getTrendDirection(analytics.summary.activeLearners.changePercentage)}
              value={formatNumber(analytics.summary.activeLearners.value)}
            />
            <MetricCard
              icon="courses"
              iconTone="violet"
              label="Published courses"
              trend={formatChange(analytics.summary.publishedCourses.changePercentage)}
              trendDirection={getTrendDirection(analytics.summary.publishedCourses.changePercentage)}
              value={formatNumber(analytics.summary.publishedCourses.value)}
            />
            <MetricCard
              icon="reports"
              iconTone="green"
              label="Completion rate"
              trend={formatChange(analytics.summary.completionRate.changePercentage)}
              trendDirection={getTrendDirection(analytics.summary.completionRate.changePercentage)}
              value={`${formatNumber(analytics.summary.completionRate.value)}%`}
            />
          </div>

          <div className={styles.dashboardGrid}>
            <Panel
              action={<span className={styles.periodBadge}>{analytics.activeLearnerGrowth.period}</span>}
              subtitle="Unique learners who opened LinCo during the period"
              title="Active learner growth"
            >
              <GrowthChart growth={analytics.activeLearnerGrowth} />
            </Panel>
            <Panel subtitle="Current account mix across the platform" title="User distribution">
              <UserDistribution distribution={analytics.userDistribution} />
            </Panel>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
