import { useState } from "react";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import SessionLoadingPage from "../features/authentication/SessionLoadingPage";
import SignInPage from "../features/authentication/SignInPage";
import useAuthSession from "../features/authentication/hooks/useAuthSession";
import CompaniesPage from "../features/companies/CompaniesPage";
import CoursesPage from "../features/courses/CoursesPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import UsersPage from "../features/users/UsersPage";
import useTheme from "../hooks/useTheme";

const pages = {
  overview: DashboardPage,
  companies: CompaniesPage,
  users: UsersPage,
  courses: CoursesPage,
};

const App = () => {
  const [activePage, setActivePage] = useState("overview");
  const { theme, toggleTheme } = useTheme();
  const {
    isAuthenticated,
    isInitializing,
    signOut,
    user,
  } = useAuthSession();
  const ActivePage = pages[activePage] || DashboardPage;

  const navigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignOut = () => {
    setActivePage("overview");
    signOut();
  };

  if (isInitializing) {
    return <SessionLoadingPage />;
  }

  if (!isAuthenticated) {
    return <SignInPage onToggleTheme={toggleTheme} theme={theme} />;
  }

  return (
    <AdminLayout
      activePage={activePage}
      onNavigate={navigate}
      onSignOut={handleSignOut}
      onToggleTheme={toggleTheme}
      theme={theme}
      user={user}
    >
      <ActivePage />
    </AdminLayout>
  );
};

export default App;
