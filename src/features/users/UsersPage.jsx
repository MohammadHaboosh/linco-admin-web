import Icon from "../../components/icons/Icon";
import commonStyles from "../../components/common/Common.module.css";
import PageHeader, { ActionButton } from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { Pagination, TableTools } from "../../components/common/TableTools";
import { users } from "../../data/mockData";
import styles from "../../styles/AdminPages.module.css";

const statusTone = (status) => status === "Active" ? "success" : status === "Invited" ? "warning" : "danger";

const UsersPage = () => (
  <div className={styles.page}>
    <PageHeader
      description="Search platform members, inspect their access, and manage account status across organizations."
      eyebrow="Identity and access"
      title="Users"
    >
      <ActionButton icon="download" variant="secondary">Export users</ActionButton>
      <ActionButton icon="plus">Invite user</ActionButton>
    </PageHeader>

    <div className={styles.summaryStrip}>
      <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="users" size={20} /></span><div><strong>9,082</strong><span>Total registered users</span></div></div>
      <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="check" size={20} /></span><div><strong>8,426</strong><span>Active this month</span></div></div>
      <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="clock" size={20} /></span><div><strong>142</strong><span>Pending invitations</span></div></div>
    </div>

    <TableTools placeholder="Search name, email, company or role..." statusLabel="All account states" />
    <div className={commonStyles.tableWrap}>
      <table className={commonStyles.table}>
        <thead><tr><th>User</th><th>Role</th><th>Company</th><th>Last active</th><th>Status</th><th aria-label="Actions" /></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td><div className={commonStyles.entity}><span className={commonStyles.avatar} data-round="true">{user.initials}</span><div><p className={commonStyles.entityName}>{user.name}</p><p className={commonStyles.entityMeta}>{user.email}</p></div></div></td>
              <td>{user.role}</td>
              <td>{user.company}</td>
              <td>{user.lastSeen}</td>
              <td><StatusBadge tone={statusTone(user.status)}>{user.status}</StatusBadge></td>
              <td><button className={commonStyles.iconButton} title={`Open actions for ${user.name}`} type="button"><Icon name="more" size={18} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Pagination label="Showing 1–6 of 9,082 users" />
  </div>
);

export default UsersPage;
