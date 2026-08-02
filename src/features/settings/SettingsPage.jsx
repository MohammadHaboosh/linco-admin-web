import Icon from "../../components/icons/Icon";
import PageHeader, { ActionButton } from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import styles from "../../styles/AdminPages.module.css";

const settings = [
  { title: "Company registrations", detail: "Allow new companies to submit workspace applications.", enabled: true },
  { title: "Manual workspace approval", detail: "Require a platform admin to approve every new workspace.", enabled: true },
  { title: "Public course publishing", detail: "Let verified companies publish courses to the shared marketplace.", enabled: false },
  { title: "Maintenance announcements", detail: "Display operational notices in all LinCo workspaces.", enabled: true },
];

const SettingsPage = () => (
  <div className={styles.page}>
    <PageHeader
      description="Configure platform defaults, registration rules, and administrator security controls."
      eyebrow="Platform configuration"
      title="Settings"
    >
      <ActionButton icon="check">Save changes</ActionButton>
    </PageHeader>
    <div className={styles.settingsGrid}>
      <Panel subtitle="These preferences apply across every LinCo workspace" title="General platform settings">
        <div className={styles.settingRows}>
          {settings.map((setting) => <div className={styles.settingRow} key={setting.title}><div><strong>{setting.title}</strong><span>{setting.detail}</span></div><button aria-label={`Toggle ${setting.title}`} className={`${styles.toggle} ${setting.enabled ? styles.toggleOn : ""}`} type="button" /></div>)}
        </div>
      </Panel>
      <div>
        <article className={styles.securityCard}>
          <span className={styles.securityCardIcon}><Icon name="audit" size={21} /></span>
          <h3>Admin security</h3>
          <p>All platform administrators use two-factor authentication. Review active sessions and recovery methods regularly.</p>
          <button type="button">Review security</button>
        </article>
      </div>
    </div>
  </div>
);

export default SettingsPage;
