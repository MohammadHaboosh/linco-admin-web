import { useEffect, useRef, useState } from "react";
import Icon from "../../components/icons/Icon";
import { navigationSections, pageTitles } from "../../config/navigation";
import {
  getUserDisplayName,
  getUserInitials,
} from "../../features/authentication/utils/authUser";
import styles from "./AdminLayout.module.css";

const supportContacts = [
  { name: "Mohammad Haboosh", phone: "00963995718434" },
  { name: "Mohammad Al Homsi", phone: "00963935038135" },
  { name: "Zain Nahlawy", phone: "00963954179314" },
  { name: "Mohammad Yazan Mahfouz", phone: "00963933803688" },
];

const SupportDialog = ({ onClose }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedElement?.focus();
    };
  }, [onClose]);

  return (
    <div
      className={styles.supportOverlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <section
        aria-describedby="support-dialog-description"
        aria-labelledby="support-dialog-title"
        aria-modal="true"
        className={styles.supportDialog}
        role="dialog"
      >
        <div className={styles.supportDialogHeader}>
          <span className={styles.supportDialogIcon}>
            <Icon name="sparkles" size={22} />
          </span>
          <div>
            <p className={styles.supportEyebrow}>Platform assistance</p>
            <h2 id="support-dialog-title">Contact the IT team</h2>
          </div>
          <button
            aria-label="Close support contacts"
            className={styles.supportCloseButton}
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <Icon name="close" size={19} />
          </button>
        </div>

        <p className={styles.supportDescription} id="support-dialog-description">
          Contact any member of our technical team for platform support.
        </p>

        <div className={styles.supportContactList}>
          {supportContacts.map((contact) => (
            <div
              className={styles.supportContact}
              key={contact.phone}
            >
              <span className={styles.supportContactAvatar} aria-hidden="true">
                {contact.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <span className={styles.supportContactDetails}>
                <strong>{contact.name}</strong>
                <span>{contact.phone}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Sidebar = ({ activePage, isOpen, onClose, onNavigate, onOpenSupport, onSignOut }) => (
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
          <span>Our technical team is one call away.</span>
          <button onClick={onOpenSupport} type="button">Open support</button>
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
  const [supportOpen, setSupportOpen] = useState(false);
  const userDisplayName = getUserDisplayName(user);
  const userInitials = getUserInitials(user);

  return (
    <div className={styles.appShell}>
      <Sidebar
        activePage={activePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={onNavigate}
        onOpenSupport={() => {
          setSidebarOpen(false);
          setSupportOpen(true);
        }}
        onSignOut={onSignOut}
      />

      {supportOpen && <SupportDialog onClose={() => setSupportOpen(false)} />}

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
