import Icon from "../../components/icons/Icon";
import MetricCard from "../../components/common/MetricCard";
import PageHeader, { ActionButton } from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import StatusBadge from "../../components/common/StatusBadge";
import commonStyles from "../../components/common/Common.module.css";
import { activity, companies } from "../../data/mockData";
import styles from "../../styles/AdminPages.module.css";

const GrowthChart = () => (
  <>
    <div className={styles.chartSummary}><strong>8,426</strong><span>+8.2% this month</span></div>
    <svg aria-label="Active learner growth chart" className={styles.lineChart} role="img" viewBox="0 0 700 230">
      <defs>
        <linearGradient id="growthFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--linco-blue-600)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--linco-blue-600)" stopOpacity="0" />
        </linearGradient>
        <filter id="pointShadow" x="-100%" y="-100%" width="300%" height="300%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="var(--linco-blue-600)" floodOpacity="0.25" />
        </filter>
      </defs>
      {[35, 80, 125, 170, 215].map((y) => <line key={y} x1="8" x2="692" y1={y} y2={y} stroke="var(--linco-chart-grid)" strokeDasharray="4 5" />)}
      <path d="M10 188 C70 180 86 161 130 166 S210 143 250 148 S330 105 370 116 S450 86 490 92 S570 55 610 70 S665 35 690 42 L690 222 L10 222 Z" fill="url(#growthFill)" />
      <path d="M10 188 C70 180 86 161 130 166 S210 143 250 148 S330 105 370 116 S450 86 490 92 S570 55 610 70 S665 35 690 42" fill="none" stroke="var(--linco-blue-600)" strokeLinecap="round" strokeWidth="4" />
      {[{x:130,y:166},{x:250,y:148},{x:370,y:116},{x:490,y:92},{x:610,y:70},{x:690,y:42}].map((point) => <circle key={point.x} cx={point.x} cy={point.y} fill="var(--linco-surface)" filter="url(#pointShadow)" r="5" stroke="var(--linco-blue-600)" strokeWidth="3" />)}
    </svg>
    <div className={styles.chartLabels}><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span></div>
  </>
);

const DashboardPage = () => (
  <div className={styles.page}>
    <PageHeader
      description="A clear view of company growth, learner activity, and the health of the LinCo platform."
      title="Platform overview"
    >
      <ActionButton icon="download" variant="secondary">Export report</ActionButton>
      <ActionButton icon="plus">Add company</ActionButton>
    </PageHeader>

    <section className={styles.insightBanner}>
      <div className={styles.insightCopy}>
        <span className={styles.insightTag}><Icon name="sparkles" size={15} />Platform pulse</span>
        <h2>Learning activity is up across every major LinCo workspace.</h2>
        <p>Company onboarding and course completion are both trending ahead of last month. Twelve new workspace applications are ready for review.</p>
      </div>
      <div className={styles.pulseStats}>
        <div className={styles.pulseStat}><strong>99.98%</strong><span>Platform uptime</span></div>
        <div className={styles.pulseStat}><strong>12</strong><span>Pending reviews</span></div>
        <div className={styles.pulseStat}><strong>31.4k</strong><span>Lessons completed</span></div>
        <div className={styles.pulseStat}><strong>4m 12s</strong><span>Average session</span></div>
      </div>
    </section>

    <div className={`${commonStyles.metricsGrid} ${styles.metricsSpacing}`}>
      <MetricCard icon="companies" iconTone="blue" label="Registered companies" trend="12.5%" value="128" />
      <MetricCard icon="users" iconTone="sky" label="Active learners" trend="8.2%" value="8,426" />
      <MetricCard icon="courses" iconTone="violet" label="Published courses" trend="6.4%" value="412" />
      <MetricCard icon="reports" iconTone="green" label="Completion rate" trend="4.1%" value="78.4%" />
    </div>

    <div className={styles.dashboardGrid}>
      <Panel
        action={<div className={styles.periodTabs}><button type="button">7D</button><button className={styles.periodActive} type="button">6M</button><button type="button">1Y</button></div>}
        subtitle="Unique learners who opened LinCo during the period"
        title="Active learner growth"
      >
        <GrowthChart />
      </Panel>
      <Panel subtitle="Current account mix across the platform" title="User distribution">
        <div className={styles.donutWrap}>
          <div className={styles.donut}><div className={styles.donutLabel}><strong>8.4k</strong><span>Total users</span></div></div>
        </div>
        <div className={styles.legend}>
          <div className={styles.legendItem} style={{ "--legend-color": "var(--linco-blue-600)" }}><i /><span>Trainees</span><strong>58%</strong></div>
          <div className={styles.legendItem} style={{ "--legend-color": "var(--linco-sky-400)" }}><i /><span>Managers</span><strong>20%</strong></div>
          <div className={styles.legendItem} style={{ "--legend-color": "var(--linco-violet)" }}><i /><span>Owners</span><strong>13%</strong></div>
          <div className={styles.legendItem} style={{ "--legend-color": "var(--linco-blue-100)" }}><i /><span>Other roles</span><strong>9%</strong></div>
        </div>
      </Panel>
    </div>

    <div className={styles.dashboardBottomGrid}>
      <Panel action={<button className={styles.panelLink} type="button">View all <Icon name="chevronRight" size={14} /></button>} subtitle="Latest workspaces added to LinCo" title="Recently joined companies">
        <table className={styles.compactTable}>
          <tbody>
            {companies.slice(0, 5).map((company) => (
              <tr key={company.id}>
                <td><div className={styles.compactEntity}><span className={styles.compactAvatar}>{company.initials}</span><div><strong>{company.name}</strong><span>{company.plan}</span></div></div></td>
                <td>{company.members.toLocaleString()} members</td>
                <td><StatusBadge tone={company.status === "Active" ? "success" : company.status === "Pending" ? "warning" : "danger"}>{company.status}</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      <Panel action={<button className={styles.panelLink} type="button">View audit log</button>} subtitle="Important changes from today" title="Recent activity">
        <div className={styles.activityList}>
          {activity.map((item) => (
            <div className={styles.activityItem} key={item.title}>
              <span className={styles.activityIcon} data-tone={item.tone}><Icon name={item.icon} size={17} /></span>
              <div><strong>{item.title}</strong><span>{item.detail}</span><small>{item.time}</small></div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  </div>
);

export default DashboardPage;
