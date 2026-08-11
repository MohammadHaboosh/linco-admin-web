import { useEffect, useState } from "react";
import Icon from "../../components/icons/Icon";
import commonStyles from "../../components/common/Common.module.css";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { Pagination, TableTools } from "../../components/common/TableTools";
import styles from "../../styles/AdminPages.module.css";
import useUserAccountAction from "./hooks/useUserAccountAction";
import useUserStats from "./hooks/useUserStats";
import useUsers from "./hooks/useUsers";

const PAGE_SIZE = 10;

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatDate = (value, includeTime = false) => {
  if (!value) {
    return "Never";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return includeTime ? dateTimeFormatter.format(date) : dateFormatter.format(date);
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

const getInitials = (user) => {
  const initials = [user.firstName, user.lastName]
    .filter(Boolean)
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();

  return initials || "U";
};

const getFullName = (user) => (
  [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Unknown user"
);

const statusTone = (status) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "success";
    case "PENDING":
    case "INVITED":
      return "warning";
    case "SUSPENDED":
    case "INACTIVE":
    case "BANNED":
      return "danger";
    default:
      return "neutral";
  }
};

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const { error, isLoading, meta, retry, users } = useUsers({
    page,
    role,
    search,
    status,
    take: PAGE_SIZE,
  });
  const {
    error: statsError,
    isLoading: statsLoading,
    retry: retryStats,
    stats,
  } = useUserStats();
  const { feedback, updateAccount, updatingUserId } = useUserAccountAction();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const firstResult = meta.itemCount === 0 ? 0 : ((meta.page - 1) * meta.take) + 1;
  const lastResult = Math.min(meta.page * meta.take, meta.itemCount);
  const resultLabel = `Showing ${firstResult}–${lastResult} of ${meta.itemCount} users`;
  const summaryValue = (value) => statsLoading || statsError ? "—" : value.toLocaleString();

  const handleAccountAction = async (user) => {
    const isActive = user.status?.toUpperCase() === "ACTIVE";
    const action = isActive ? "suspend" : "activate";
    const fullName = getFullName(user);

    if (
      isActive
      && !window.confirm(
        `Suspend ${fullName}'s account?`,
      )
    ) {
      return;
    }

    const wasUpdated = await updateAccount({
      action,
      name: fullName,
      userId: user.id,
    });

    if (wasUpdated) {
      retry();
      retryStats();
    }
  };

  const handleFilterChange = (setter) => (event) => {
    setPage(1);
    setter(event.target.value);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        description="Search platform members, inspect their access, and manage account status."
        eyebrow="Identity and access"
        title="Users"
      />

      <div className={`${styles.summaryStrip} ${styles.summaryStripFour}`}>
        <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="users" size={20} /></span><div><strong>{summaryValue(stats.totalUsers)}</strong><span>Total users</span></div></div>
        <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="check" size={20} /></span><div><strong>{summaryValue(stats.verifiedAccounts)}</strong><span>Verified accounts</span></div></div>
        <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="clock" size={20} /></span><div><strong>{summaryValue(stats.newThisMonth)}</strong><span>New this month</span></div></div>
        <div className={styles.summaryCard}><span className={styles.summaryIcon}><Icon name="shield" size={20} /></span><div><strong>{summaryValue(stats.twoFactorEnabled)}</strong><span>Two-factor enabled</span></div></div>
      </div>
      {statsError && (
        <div className={styles.statsError} role="alert">
          <span>{statsError}</span>
          <button onClick={retryStats} type="button">Try again</button>
        </div>
      )}

      <TableTools
        onSearchChange={setSearchInput}
        placeholder="Search users by name or email..."
        searchValue={searchInput}
        showFilters={false}
      >
        <label className={commonStyles.filterField}>
          <span>Status</span>
          <select
            className={commonStyles.select}
            onChange={handleFilterChange(setStatus)}
            value={status}
          >
            <option value="">Show both statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </label>
        <label className={commonStyles.filterField}>
          <span>Role</span>
          <select
            className={commonStyles.select}
            onChange={handleFilterChange(setRole)}
            value={role}
          >
            <option value="">Show both roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
      </TableTools>
      {feedback && (
        <div
          className={styles.actionFeedback}
          data-tone={feedback.tone}
          role={feedback.tone === "error" ? "alert" : "status"}
        >
          <Icon name={feedback.tone === "error" ? "alert" : "check"} size={17} />
          <span>{feedback.message}</span>
        </div>
      )}
      <div className={commonStyles.tableWrap}>
        <table aria-busy={isLoading} className={commonStyles.table}>
          <thead><tr><th>User</th><th>Role</th><th>Email verified</th><th>Joined</th><th>Last active</th><th>Status</th><th aria-label="Actions" /></tr></thead>
          <tbody>
            {isLoading ? (
              <tr><td className={styles.tableState} colSpan="7">Loading users...</td></tr>
            ) : error ? (
              <tr>
                <td className={styles.tableState} colSpan="7">
                  <div role="alert">
                    <strong>Users could not be loaded</strong>
                    <span>{error}</span>
                    <button onClick={retry} type="button">Try again</button>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr><td className={styles.tableState} colSpan="7">No users found.</td></tr>
            ) : users.map((user) => {
              const fullName = getFullName(user);

              return (
                <tr key={user.id}>
                  <td>
                    <div className={commonStyles.entity}>
                      <span className={commonStyles.avatar} data-round="true">
                        {user.imagePath ? <img alt="" src={user.imagePath} /> : getInitials(user)}
                      </span>
                      <div><p className={commonStyles.entityName}>{fullName}</p><p className={commonStyles.entityMeta}>{user.email}</p></div>
                    </div>
                  </td>
                  <td>{formatEnum(user.role)}</td>
                  <td><StatusBadge tone={user.isEmailVerified ? "success" : "warning"}>{user.isEmailVerified ? "Verified" : "Unverified"}</StatusBadge></td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{formatDate(user.lastActiveAt, true)}</td>
                  <td><StatusBadge tone={statusTone(user.status)}>{formatEnum(user.status)}</StatusBadge></td>
                  <td>
                    {(
                      user.role?.toUpperCase() !== "ADMIN"
                      && ["ACTIVE", "SUSPENDED"].includes(user.status?.toUpperCase())
                    ) ? (
                      <button
                        className={styles.accountActionButton}
                        data-action={user.status.toUpperCase() === "ACTIVE" ? "suspend" : "activate"}
                        disabled={Boolean(updatingUserId)}
                        onClick={() => handleAccountAction(user)}
                        type="button"
                      >
                        {updatingUserId === user.id
                          ? user.status.toUpperCase() === "ACTIVE" ? "Suspending..." : "Reactivating..."
                          : user.status.toUpperCase() === "ACTIVE" ? "Suspend" : "Reactivate"}
                      </button>
                    ) : "—"}
                  </td>
                </tr>
              );
            })}
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

export default UsersPage;
