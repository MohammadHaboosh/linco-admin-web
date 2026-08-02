import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
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
  const ActivePage = pages[activePage] || DashboardPage;

  const navigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AdminLayout activePage={activePage} onNavigate={navigate}>
      <ActivePage />
    </AdminLayout>
  );
};

export default App;
