export const navigationSections = [
  {
    label: "Platform",
    items: [
      { id: "overview", label: "Overview", icon: "overview" },
      { id: "companies", label: "Companies", icon: "companies" },
      { id: "users", label: "Users", icon: "users" },
    ],
  },
  {
    label: "Learning",
    items: [
      { id: "courses", label: "Course Library", icon: "courses" },
      { id: "reports", label: "Reports", icon: "reports" },
    ],
  },
];

export const pageTitles = navigationSections
  .flatMap((section) => section.items)
  .reduce((titles, item) => ({ ...titles, [item.id]: item.label }), {});
