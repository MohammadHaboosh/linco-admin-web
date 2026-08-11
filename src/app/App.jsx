import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import SignInPage from "../features/authentication/SignInPage";
import useAuthSession from "../features/authentication/hooks/useAuthSession";
import AuditLogPage from "../features/audit/AuditLogPage";
import CompaniesPage from "../features/companies/CompaniesPage";
import CoursesPage from "../features/courses/CoursesPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import ReportsPage from "../features/reports/ReportsPage";
import SettingsPage from "../features/settings/SettingsPage";
import UsersPage from "../features/users/UsersPage";

const pages = {
  overview: DashboardPage,
  companies: CompaniesPage,
  users: UsersPage,
  courses: CoursesPage,
  reports: ReportsPage,
  audit: AuditLogPage,
  settings: SettingsPage,
};

const App = () => {
  const [activePage, setActivePage] = useState("overview");
  const { isAuthenticated, signOut, user } = useAuthSession();
  const ActivePage = pages[activePage] || DashboardPage;

  const navigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignOut = () => {
    setActivePage("overview");
    signOut();
  };

  if (!isAuthenticated) {
    return <SignInPage />;
  }

  return (
    <AdminLayout
      activePage={activePage}
      onNavigate={navigate}
      onSignOut={handleSignOut}
      user={user}
    >
      <ActivePage />
    </AdminLayout>
  );
};

export default App;
