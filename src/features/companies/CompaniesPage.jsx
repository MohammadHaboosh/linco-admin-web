import Icon from "../../components/icons/Icon";
import commonStyles from "../../components/common/Common.module.css";
import PageHeader, { ActionButton } from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { Pagination, TableTools } from "../../components/common/TableTools";
import { companies } from "../../data/mockData";
import styles from "../../styles/AdminPages.module.css";

const statusTone = (status) => status === "Active" ? "success" : status === "Pending" ? "warning" : "danger";

const CompaniesPage = () => (
  <div className={styles.page}>
    <PageHeader
      description="Review, approve, and monitor every company workspace connected to the LinCo platform."
      eyebrow="Workspace administration"
      title="Companies"
    >
      <ActionButton icon="download" variant="secondary">Export list</ActionButton>
      <ActionButton icon="plus">Add company</ActionButton>
    </PageHeader>

    <div className={styles.summaryStrip}>
      <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="companies" size={20} /></span><div><strong>128</strong><span>Total companies</span></div></div>
      <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="clock" size={20} /></span><div><strong>12</strong><span>Awaiting approval</span></div></div>
      <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="users" size={20} /></span><div><strong>8,426</strong><span>Members across workspaces</span></div></div>
    </div>

    <TableTools placeholder="Search by company or workspace..." />
    <div className={commonStyles.tableWrap}>
      <table className={commonStyles.table}>
        <thead><tr><th>Company</th><th>Plan</th><th>Members</th><th>Departments</th><th>Joined</th><th>Status</th><th aria-label="Actions" /></tr></thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td><div className={commonStyles.entity}><span className={commonStyles.avatar}>{company.initials}</span><div><p className={commonStyles.entityName}>{company.name}</p><p className={commonStyles.entityMeta}>{company.slug}</p></div></div></td>
              <td>{company.plan}</td>
              <td>{company.members.toLocaleString()}</td>
              <td>{company.departments}</td>
              <td>{company.joined}</td>
              <td><StatusBadge tone={statusTone(company.status)}>{company.status}</StatusBadge></td>
              <td><button className={commonStyles.iconButton} title={`Open actions for ${company.name}`} type="button"><Icon name="more" size={18} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Pagination label="Showing 1–6 of 128 companies" />
  </div>
);

export default CompaniesPage;
