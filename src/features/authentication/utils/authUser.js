export const getUserInitials = (user) => {
  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((name) => name.trim().charAt(0).toUpperCase())
    .join("");

  return initials || user?.email?.charAt(0).toUpperCase() || "A";
};

export const getUserDisplayName = (user) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  return fullName || user?.email || "Administrator";
};

export const formatUserRole = (role) => {
  if (!role) {
    return "Platform administrator";
  }

  return role
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
