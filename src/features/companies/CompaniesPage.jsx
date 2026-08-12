import { useEffect, useState } from "react";
import commonStyles from "../../components/common/Common.module.css";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { Pagination, TableTools } from "../../components/common/TableTools";
import Icon from "../../components/icons/Icon";
import styles from "../../styles/AdminPages.module.css";
import CompanyAvatar from "./components/CompanyAvatar";
import useCompanies from "./hooks/useCompanies";
import useCompanyStats from "./hooks/useCompanyStats";

const PAGE_SIZE = 10;

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const formatDate = (value) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
};

const formatEnum = (value) => {
  if (!value) {
    return "—";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const statusTone = (status) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "success";
    case "TRIALING":
      return "warning";
    case "EXPIRED":
      return "danger";
    default:
      return "neutral";
  }
};

const CompaniesPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");
  const {
    companies,
    error,
    isLoading,
    meta,
    retry,
  } = useCompanies({
    page,
    search,
    status,
    take: PAGE_SIZE,
  });
  const {
    error: statsError,
    isLoading: statsLoading,
    retry: retryStats,
    stats,
  } = useCompanyStats();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const firstResult = meta.itemCount === 0 ? 0 : ((meta.page - 1) * meta.take) + 1;
  const lastResult = Math.min(meta.page * meta.take, meta.itemCount);
  const resultLabel = `Showing ${firstResult}–${lastResult} of ${meta.itemCount} companies`;
  const summaryValue = (value) => (
    statsLoading || statsError ? "—" : value.toLocaleString()
  );

  const handleStatusChange = (event) => {
    setPage(1);
    setStatus(event.target.value);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        description="Search and monitor every company workspace connected to the LinCo platform."
        eyebrow="Workspace administration"
        title="Companies"
      />

      <div className={`${styles.summaryStrip} ${styles.summaryStripFour}`}>
        <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="companies" size={20} /></span><div><strong>{summaryValue(stats.totalCompanies)}</strong><span>Total companies</span></div></div>
        <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="check" size={20} /></span><div><strong>{summaryValue(stats.activeCompanies)}</strong><span>Active companies</span></div></div>
        <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="clock" size={20} /></span><div><strong>{summaryValue(stats.newCompaniesThisMonth)}</strong><span>New this month</span></div></div>
        <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="users" size={20} /></span><div><strong>{summaryValue(stats.totalMembers)}</strong><span>Total members</span></div></div>
      </div>
      {statsError && (
        <div className={styles.statsError} role="alert">
          <span>{statsError}</span>
          <button onClick={retryStats} type="button">Try again</button>
        </div>
      )}

      <TableTools
        onSearchChange={setSearchInput}
        placeholder="Search companies by name..."
        searchValue={searchInput}
        showFilters={false}
      >
        <label className={commonStyles.filterField}>
          <span>Subscription status</span>
          <select
            className={commonStyles.select}
            onChange={handleStatusChange}
            value={status}
          >
            <option value="">All statuses</option>
            <option value="TRIALING">Trialing</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </label>
      </TableTools>

      <div className={commonStyles.tableWrap}>
        <table aria-busy={isLoading} className={commonStyles.table}>
          <thead>
            <tr>
              <th>Company</th>
              <th>Plan</th>
              <th>Members</th>
              <th>Departments</th>
              <th>Joined</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td className={styles.tableState} colSpan="6">Loading companies...</td></tr>
            ) : error ? (
              <tr>
                <td className={styles.tableState} colSpan="6">
                  <div role="alert">
                    <strong>Companies could not be loaded</strong>
                    <span>{error}</span>
                    <button onClick={retry} type="button">Try again</button>
                  </div>
                </td>
              </tr>
            ) : companies.length === 0 ? (
              <tr><td className={styles.tableState} colSpan="6">No companies found.</td></tr>
            ) : companies.map((company) => (
              <tr key={company.id}>
                <td>
                  <div className={commonStyles.entity}>
                    <CompanyAvatar imagePath={company.imagePath} name={company.name} />
                    <p className={commonStyles.entityName}>{company.name || "Unnamed company"}</p>
                  </div>
                </td>
                <td>{formatEnum(company.plan)}</td>
                <td>{Number(company.membersCount || 0).toLocaleString()}</td>
                <td>{Number(company.departmentsCount || 0).toLocaleString()}</td>
                <td>{formatDate(company.createdAt)}</td>
                <td>
                  <StatusBadge tone={statusTone(company.subscriptionStatus)}>
                    {formatEnum(company.subscriptionStatus)}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isLoading && !error && (
        <Pagination
          hasNextPage={meta.hasNextPage}
          hasPreviousPage={meta.hasPreviousPage}
          label={resultLabel}
          onPageChange={setPage}
          page={meta.page}
          pageCount={meta.pageCount}
        />
      )}
    </div>
  );
};

export default CompaniesPage;
