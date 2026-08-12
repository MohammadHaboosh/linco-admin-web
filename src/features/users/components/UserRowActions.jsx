import Icon from "../../../components/icons/Icon";
import styles from "../../../styles/AdminPages.module.css";

const ACCOUNT_ACTIONS = {
  ACTIVE: {
    action: "suspend",
    icon: "alert",
    label: "Suspend",
    pendingLabel: "Suspending...",
  },
  SUSPENDED: {
    action: "activate",
    icon: "check",
    label: "Reactivate",
    pendingLabel: "Reactivating...",
  },
};

const UserRowActions = ({
  fullName,
  onAccountAction,
  onPromoteToAdmin,
  pendingAction,
  user,
}) => {
  if (user.role?.toUpperCase() === "ADMIN") {
    return "—";
  }

  const accountAction = ACCOUNT_ACTIONS[user.status?.toUpperCase()];
  const isBusy = Boolean(pendingAction);
  const isPendingForUser = pendingAction?.userId === user.id;

  return (
    <div className={styles.userActions}>
      <button
        aria-label={`Make ${fullName} an administrator`}
        className={styles.userActionButton}
        data-action="promote"
        disabled={isBusy}
        onClick={() => onPromoteToAdmin(user)}
        type="button"
      >
        <Icon name="shield" size={14} />
        {isPendingForUser && pendingAction.action === "promote"
          ? "Promoting..."
          : "Make admin"}
      </button>
      {accountAction && (
        <button
          aria-label={`${accountAction.label} ${fullName}`}
          className={styles.userActionButton}
          data-action={accountAction.action}
          disabled={isBusy}
          onClick={() => onAccountAction(user)}
          type="button"
        >
          <Icon name={accountAction.icon} size={14} />
          {isPendingForUser && pendingAction.action === accountAction.action
            ? accountAction.pendingLabel
            : accountAction.label}
        </button>
      )}
    </div>
  );
};

export default UserRowActions;
