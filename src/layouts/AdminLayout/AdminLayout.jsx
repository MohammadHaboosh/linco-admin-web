import { useState } from "react";
import Icon from "../../components/icons/Icon";
import { navigationSections, pageTitles } from "../../config/navigation";
import styles from "./AdminLayout.module.css";

const Sidebar = ({ activePage, isOpen, onClose, onNavigate }) => (
  <>
    <button
      aria-label="Close navigation"
      className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`}
      onClick={onClose}
      tabIndex={isOpen ? 0 : -1}
      type="button"
    />
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.brandRow}>
        <div className={styles.brandMark}>
          <img alt="LinCo mascot" src="/linco-logo.png" />
        </div>
        <div>
          <p className={styles.brandName}>LinCo<span>.</span></p>
          <p className={styles.brandMeta}>Platform control</p>
        </div>
        <button aria-label="Close menu" className={styles.closeMenu} onClick={onClose} type="button">
          <Icon name="close" size={20} />
        </button>
      </div>

      <nav className={styles.navigation}>
        {navigationSections.map((section) => (
          <div className={styles.navSection} key={section.label}>
            <p className={styles.navLabel}>{section.label}</p>
            <div className={styles.navList}>
              {section.items.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    aria-current={isActive ? "page" : undefined}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    type="button"
                  >
                    <Icon name={item.icon} size={19} />
                    <span>{item.label}</span>
                    {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={styles.sidebarBottom}>
        <div className={styles.supportCard}>
          <span className={styles.supportIcon}><Icon name="sparkles" size={18} /></span>
          <p>Need platform support?</p>
          <span>Our technical team is one message away.</span>
          <button type="button">Open support</button>
        </div>
        <button className={styles.signOut} type="button">
          <Icon name="logout" size={18} />
          Sign out
        </button>
      </div>
    </aside>
  </>
);

const NotificationMenu = () => (
  <div className={styles.notificationMenu}>
    <div className={styles.notificationHeader}>
      <div>
        <strong>Notifications</strong>
        <span>3 items need attention</span>
      </div>
      <button type="button">Mark all read</button>
    </div>
    <div className={styles.notificationItem}>
      <span className={styles.notificationIcon} data-tone="warning"><Icon name="alert" size={17} /></span>
      <div><strong>12 companies await approval</strong><span>Review company verification requests.</span><small>8 min ago</small></div>
    </div>
    <div className={styles.notificationItem}>
      <span className={styles.notificationIcon} data-tone="success"><Icon name="check" size={17} /></span>
      <div><strong>Weekly report is ready</strong><span>Platform health report was generated.</span><small>1 hour ago</small></div>
    </div>
    <div className={styles.notificationItem}>
      <span className={styles.notificationIcon}><Icon name="users" size={17} /></span>
      <div><strong>New user milestone</strong><span>8,000 active learners reached.</span><small>Yesterday</small></div>
    </div>
  </div>
);

const AdminLayout = ({ activePage, children, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className={styles.appShell}>
      <Sidebar
        activePage={activePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={onNavigate}
      />

      <div className={styles.mainColumn}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              aria-label="Open navigation"
              className={styles.menuButton}
              onClick={() => setSidebarOpen(true)}
              type="button"
            >
              <Icon name="menu" size={21} />
            </button>
            <div className={styles.breadcrumb}>
              <span>Admin</span>
              <Icon name="chevronRight" size={14} />
              <strong>{pageTitles[activePage]}</strong>
            </div>
          </div>

          <label className={styles.globalSearch}>
            <Icon name="search" size={18} />
            <input aria-label="Search the platform" placeholder="Search companies, users or courses..." type="search" />
            <span>⌘ K</span>
          </label>

          <div className={styles.topbarActions}>
            <span className={styles.systemStatus}><i />System healthy</span>
            <div className={styles.notificationWrap}>
              <button
                aria-expanded={notificationsOpen}
                aria-label="Notifications"
                className={styles.topbarIconButton}
                onClick={() => setNotificationsOpen((current) => !current)}
                type="button"
              >
                <Icon name="bell" size={20} />
                <span className={styles.notificationDot}>3</span>
              </button>
              {notificationsOpen && <NotificationMenu />}
            </div>
            <button className={styles.profileButton} type="button">
              <span className={styles.profileAvatar}>OK</span>
              <span className={styles.profileCopy}>
                <strong>Omar Khalil</strong>
                <small>Platform admin</small>
              </span>
              <Icon name="chevronDown" size={15} />
            </button>
          </div>
        </header>

        <main className={styles.content} key={activePage}>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
