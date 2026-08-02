import Icon from "../../components/icons/Icon";
import commonStyles from "../../components/common/Common.module.css";
import PageHeader, { ActionButton } from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { Pagination, TableTools } from "../../components/common/TableTools";
import { auditLogs } from "../../data/mockData";
import styles from "../../styles/AdminPages.module.css";

const AuditLogPage = () => (
  <div className={styles.page}>
    <PageHeader
      description="A traceable history of security-sensitive actions and important platform events."
      eyebrow="Security and compliance"
      title="Audit log"
    >
      <ActionButton icon="download" variant="secondary">Export log</ActionButton>
    </PageHeader>
    <TableTools placeholder="Search actor, action, target or IP address..." statusLabel="All risk levels" />
    <div className={commonStyles.tableWrap}>
      <table className={commonStyles.table}>
        <thead><tr><th>Event ID</th><th>Actor</th><th>Action</th><th>Target</th><th>IP address</th><th>Time</th><th>Risk</th><th aria-label="Actions" /></tr></thead>
        <tbody>
          {auditLogs.map((log) => (
            <tr key={log.id}>
              <td><strong>{log.id}</strong></td><td>{log.actor}</td><td>{log.action}</td><td>{log.target}</td><td>{log.ip}</td><td>{log.time}</td>
              <td><StatusBadge tone={log.risk === "Normal" ? "success" : log.risk === "Review" ? "warning" : "danger"}>{log.risk}</StatusBadge></td>
              <td><button className={commonStyles.iconButton} title={`Open ${log.id}`} type="button"><Icon name="external" size={16} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Pagination label="Showing 1–6 of 2,418 events" />
  </div>
);

export default AuditLogPage;
