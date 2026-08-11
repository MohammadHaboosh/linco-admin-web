export const companies = [
  { id: 1, initials: "TC", name: "TechCorp", slug: "techcorp.linco", plan: "Enterprise", members: 842, departments: 14, joined: "Jul 28, 2026", status: "Active" },
  { id: 2, initials: "NA", name: "Nexa Academy", slug: "nexa.linco", plan: "Professional", members: 516, departments: 9, joined: "Jul 26, 2026", status: "Active" },
  { id: 3, initials: "BL", name: "BuildLab", slug: "buildlab.linco", plan: "Professional", members: 394, departments: 7, joined: "Jul 21, 2026", status: "Pending" },
  { id: 4, initials: "DS", name: "Damascus Systems", slug: "damsys.linco", plan: "Enterprise", members: 1182, departments: 22, joined: "Jul 18, 2026", status: "Active" },
  { id: 5, initials: "FV", name: "Future Vision", slug: "futurevision.linco", plan: "Starter", members: 86, departments: 3, joined: "Jul 12, 2026", status: "Suspended" },
  { id: 6, initials: "QC", name: "Quantum Code", slug: "quantum.linco", plan: "Professional", members: 271, departments: 6, joined: "Jul 08, 2026", status: "Active" },
];

export const courses = [
  { id: 1, code: "RD", title: "React Development Mastery", category: "Development", creator: "TechCorp", learners: 1248, completion: 82, rating: "4.9", status: "Published" },
  { id: 2, code: "UX", title: "Product Design Foundations", category: "Design", creator: "Nexa Academy", learners: 816, completion: 74, rating: "4.8", status: "Published" },
  { id: 3, code: "NL", title: "Modern Node.js Architecture", category: "Development", creator: "BuildLab", learners: 594, completion: 68, rating: "4.7", status: "Review" },
  { id: 4, code: "PM", title: "Agile Project Leadership", category: "Management", creator: "Damascus Systems", learners: 482, completion: 79, rating: "4.8", status: "Published" },
  { id: 5, code: "DB", title: "Database Systems Essentials", category: "Data", creator: "Quantum Code", learners: 361, completion: 61, rating: "4.6", status: "Draft" },
  { id: 6, code: "CS", title: "Cybersecurity for Teams", category: "Security", creator: "LinCo Originals", learners: 907, completion: 87, rating: "4.9", status: "Published" },
];

export const activity = [
  { icon: "companies", tone: "blue", title: "Company approved", detail: "TechCorp completed platform verification.", time: "8 min ago" },
  { icon: "courses", tone: "green", title: "Course published", detail: "Cybersecurity for Teams is now public.", time: "42 min ago" },
  { icon: "users", tone: "violet", title: "New owner joined", detail: "Sara Ahmad created a workspace.", time: "2 hrs ago" },
  { icon: "alert", tone: "warning", title: "Usage threshold reached", detail: "Nexa Academy used 90% of seats.", time: "5 hrs ago" },
];

export const auditLogs = [
  { id: "LOG-8241", actor: "Omar Khalil", action: "Approved company", target: "TechCorp", ip: "185.194.86.12", time: "Today, 10:42 AM", risk: "Normal" },
  { id: "LOG-8240", actor: "Sara Ahmad", action: "Updated user role", target: "Lina Mansour", ip: "185.112.44.08", time: "Today, 10:18 AM", risk: "Normal" },
  { id: "LOG-8239", actor: "System", action: "Blocked sign-in attempt", target: "Unknown account", ip: "91.214.72.19", time: "Today, 9:54 AM", risk: "Review" },
  { id: "LOG-8238", actor: "Omar Khalil", action: "Suspended workspace", target: "Future Vision", ip: "185.194.86.12", time: "Today, 9:36 AM", risk: "Elevated" },
  { id: "LOG-8237", actor: "System", action: "Generated report", target: "Weekly platform report", ip: "Internal", time: "Today, 8:00 AM", risk: "Normal" },
  { id: "LOG-8236", actor: "Hadi Youssef", action: "Published course", target: "Agile Project Leadership", ip: "178.253.62.71", time: "Yesterday, 6:22 PM", risk: "Normal" },
];
