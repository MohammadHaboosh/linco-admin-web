import { useState } from "react";
import Icon from "../../components/icons/Icon";
import { navigationSections, pageTitles } from "../../config/navigation";
import {
  getUserDisplayName,
  getUserInitials,
} from "../../features/authentication/utils/authUser";
import styles from "./AdminLayout.module.css";

const Sidebar = ({ activePage, isOpen, onClose, onNavigate, onSignOut }) => (
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
        <button className={styles.signOut} onClick={onSignOut} type="button">
          <Icon name="logout" size={18} />
          Sign out
        </button>
      </div>
    </aside>
  </>
);

const AdminLayout = ({ activePage, children, onNavigate, onSignOut, onToggleTheme, theme, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userDisplayName = getUserDisplayName(user);
  const userInitials = getUserInitials(user);

  return (
    <div className={styles.appShell}>
      <Sidebar
        activePage={activePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={onNavigate}
        onSignOut={onSignOut}
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

          <div className={styles.topbarActions}>
            <button
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              className={styles.themeToggle}
              onClick={onToggleTheme}
              title={`Use ${theme === "dark" ? "light" : "dark"} theme`}
              type="button"
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
            </button>
            <div className={styles.profile}>
              <span className={styles.profileAvatar}>
                {user?.imagePath ? (
                  <img alt="" src={user.imagePath} />
                ) : userInitials}
              </span>
              <span className={styles.profileCopy}>
                <strong>{userDisplayName}</strong>
              </span>
            </div>
          </div>
        </header>

        <main className={styles.content} key={activePage}>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
