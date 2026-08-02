import Icon from "../../components/icons/Icon";
import PageHeader, { ActionButton } from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import styles from "../../styles/AdminPages.module.css";

const reportBars = [
  { month: "Mar", active: 62, completion: 42 },
  { month: "Apr", active: 74, completion: 52 },
  { month: "May", active: 68, completion: 57 },
  { month: "Jun", active: 85, completion: 61 },
  { month: "Jul", active: 92, completion: 70 },
  { month: "Aug", active: 96, completion: 78 },
];

const ReportsPage = () => (
  <div className={styles.page}>
    <PageHeader
      description="Track learning adoption, completion quality, and system performance across the platform."
      eyebrow="Analytics center"
      title="Reports"
    >
      <ActionButton icon="download" variant="secondary">Download PDF</ActionButton>
      <ActionButton icon="plus">New report</ActionButton>
    </PageHeader>

    <div className={styles.reportGrid}>
      <Panel subtitle="Active learners compared with completed learning paths" title="Learning engagement">
        <div className={styles.barChart}>
          {reportBars.map((item) => <div className={styles.barGroup} key={item.month}><span className={styles.bar} style={{ height: `${item.active}%` }} /><span className={`${styles.bar} ${styles.barSecondary}`} style={{ height: `${item.completion}%` }} /></div>)}
        </div>
        <div className={styles.barLabels}>{reportBars.map((item) => <span key={item.month}>{item.month}</span>)}</div>
      </Panel>

      <Panel subtitle="Operational targets for the current month" title="Platform health">
        <div className={styles.healthList}>
          {[{ label: "API availability", value: 99.98 }, { label: "Course completion", value: 78.4 }, { label: "Workspace activation", value: 91 }, { label: "Support response SLA", value: 94 }].map((item) => (
            <div key={item.label}>
              <div className={styles.healthRowHeader}><span>{item.label}</span><strong>{item.value}%</strong></div>
              <div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: `${item.value}%` }} /></div>
            </div>
          ))}
        </div>
      </Panel>
    </div>

    <div className={styles.reportCards}>
      {[{ icon: "companies", title: "Company adoption", copy: "Workspace growth, plan distribution, and company engagement." }, { icon: "users", title: "Learner performance", copy: "Completion rates, activity levels, XP, and certificate progress." }, { icon: "courses", title: "Content performance", copy: "Enrollment, ratings, drop-off, and curriculum quality insights." }].map((report) => (
        <article className={styles.reportCard} key={report.title}>
          <div className={styles.reportCardTop}><span className={styles.reportCardIcon}><Icon name={report.icon} size={19} /></span><Icon name="external" size={16} /></div>
          <h3>{report.title}</h3><p>{report.copy}</p><button type="button">Open report <Icon name="chevronRight" size={13} /></button>
        </article>
      ))}
    </div>
  </div>
);

export default ReportsPage;
