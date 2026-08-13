export const PERMISSIONS = {
  CUSTOMERS_VIEW: "customers.view",
  CUSTOMERS_EDIT: "customers.edit",
  CUSTOMERS_CREATE: "customers.create",
  CUSTOMERS_DELETE: "customers.delete",

  BOOKINGS_VIEW: "bookings.view",
  BOOKINGS_CREATE: "bookings.create",
  BOOKINGS_EDIT: "bookings.edit",
  BOOKINGS_CANCEL: "bookings.cancel",
  BOOKINGS_COMPLETE: "bookings.complete",

  CONTENT_VIEW: "content.view",
  CONTENT_CREATE: "content.create",
  CONTENT_EDIT: "content.edit",
  CONTENT_DELETE: "content.delete",

  NEWSLETTER_VIEW: "newsletter.view",
  NEWSLETTER_MANAGE: "newsletter.manage",

  DASHBOARD_OPERATIONAL: "dashboard.operational.view",

  FINANCE_VIEW: "finance.view",
  FINANCE_MANAGE: "finance.manage",

  EMPLOYEES_VIEW: "employees.view",
  EMPLOYEES_EDIT: "employees.edit",
  EMPLOYEES_CREATE: "employees.create",
  EMPLOYEES_DELETE: "employees.delete",

  ROLES_VIEW: "roles.view",
  ROLES_EDIT: "roles.edit",

  SETTINGS_VIEW: "settings.view",
  SETTINGS_EDIT: "settings.edit",
  SETTINGS_SECURITY: "settings.security",
  SETTINGS_INTEGRATIONS: "settings.integrations",

  AUDIT_VIEW: "audit.view",
  AUDIT_MANAGE: "audit.manage",

  NOTIFICATIONS_MANAGE: "notifications.manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);

/** Sensitive capabilities that default employee roles never receive. Owner may grant them explicitly. */
export const OWNER_DEFAULT_PERMISSIONS: Permission[] = [
  PERMISSIONS.FINANCE_VIEW,
  PERMISSIONS.FINANCE_MANAGE,
  PERMISSIONS.EMPLOYEES_VIEW,
  PERMISSIONS.EMPLOYEES_EDIT,
  PERMISSIONS.EMPLOYEES_CREATE,
  PERMISSIONS.EMPLOYEES_DELETE,
  PERMISSIONS.ROLES_VIEW,
  PERMISSIONS.ROLES_EDIT,
  PERMISSIONS.SETTINGS_EDIT,
  PERMISSIONS.SETTINGS_SECURITY,
  PERMISSIONS.SETTINGS_INTEGRATIONS,
  PERMISSIONS.AUDIT_VIEW,
  PERMISSIONS.AUDIT_MANAGE,
  PERMISSIONS.NOTIFICATIONS_MANAGE,
  PERMISSIONS.CUSTOMERS_DELETE,
];

export const PERMISSION_GROUPS: { id: string; label: string; permissions: Permission[] }[] = [
  {
    id: "customers",
    label: "Customers",
    permissions: [
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.CUSTOMERS_EDIT,
      PERMISSIONS.CUSTOMERS_CREATE,
      PERMISSIONS.CUSTOMERS_DELETE,
    ],
  },
  {
    id: "bookings",
    label: "Bookings",
    permissions: [
      PERMISSIONS.BOOKINGS_VIEW,
      PERMISSIONS.BOOKINGS_CREATE,
      PERMISSIONS.BOOKINGS_EDIT,
      PERMISSIONS.BOOKINGS_CANCEL,
      PERMISSIONS.BOOKINGS_COMPLETE,
    ],
  },
  {
    id: "content",
    label: "Content",
    permissions: [
      PERMISSIONS.CONTENT_VIEW,
      PERMISSIONS.CONTENT_CREATE,
      PERMISSIONS.CONTENT_EDIT,
      PERMISSIONS.CONTENT_DELETE,
    ],
  },
  {
    id: "operations",
    label: "Operations",
    permissions: [
      PERMISSIONS.DASHBOARD_OPERATIONAL,
      PERMISSIONS.NEWSLETTER_VIEW,
      PERMISSIONS.NEWSLETTER_MANAGE,
    ],
  },
  {
    id: "finance",
    label: "Finance",
    permissions: [PERMISSIONS.FINANCE_VIEW, PERMISSIONS.FINANCE_MANAGE],
  },
  {
    id: "employees",
    label: "Employees",
    permissions: [
      PERMISSIONS.EMPLOYEES_VIEW,
      PERMISSIONS.EMPLOYEES_EDIT,
      PERMISSIONS.EMPLOYEES_CREATE,
      PERMISSIONS.EMPLOYEES_DELETE,
    ],
  },
  {
    id: "roles",
    label: "Roles & permissions",
    permissions: [PERMISSIONS.ROLES_VIEW, PERMISSIONS.ROLES_EDIT],
  },
  {
    id: "system",
    label: "System",
    permissions: [
      PERMISSIONS.SETTINGS_VIEW,
      PERMISSIONS.SETTINGS_EDIT,
      PERMISSIONS.SETTINGS_SECURITY,
      PERMISSIONS.SETTINGS_INTEGRATIONS,
      PERMISSIONS.AUDIT_VIEW,
      PERMISSIONS.AUDIT_MANAGE,
      PERMISSIONS.NOTIFICATIONS_MANAGE,
    ],
  },
];

export const DEFAULT_EMPLOYEE_ROLES: {
  slug: string;
  name: string;
  description: string;
  permissions: Permission[];
}[] = [
  {
    slug: "worker",
    name: "Worker",
    description: "Operational view of bookings and published content.",
    permissions: [
      PERMISSIONS.DASHBOARD_OPERATIONAL,
      PERMISSIONS.BOOKINGS_VIEW,
      PERMISSIONS.CONTENT_VIEW,
    ],
  },
  {
    slug: "support",
    name: "Customer Support",
    description: "Help travellers with profiles and booking status.",
    permissions: [
      PERMISSIONS.DASHBOARD_OPERATIONAL,
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.CUSTOMERS_EDIT,
      PERMISSIONS.BOOKINGS_VIEW,
      PERMISSIONS.BOOKINGS_EDIT,
      PERMISSIONS.BOOKINGS_CREATE,
      PERMISSIONS.BOOKINGS_CANCEL,
      PERMISSIONS.CONTENT_VIEW,
    ],
  },
  {
    slug: "sales",
    name: "Sales",
    description: "Create and follow up on customer bookings.",
    permissions: [
      PERMISSIONS.DASHBOARD_OPERATIONAL,
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.CUSTOMERS_CREATE,
      PERMISSIONS.CUSTOMERS_EDIT,
      PERMISSIONS.BOOKINGS_VIEW,
      PERMISSIONS.BOOKINGS_CREATE,
      PERMISSIONS.BOOKINGS_EDIT,
      PERMISSIONS.CONTENT_VIEW,
    ],
  },
  {
    slug: "manager",
    name: "Manager",
    description: "Run day-to-day operations without owner-only controls.",
    permissions: [
      PERMISSIONS.DASHBOARD_OPERATIONAL,
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.CUSTOMERS_EDIT,
      PERMISSIONS.CUSTOMERS_CREATE,
      PERMISSIONS.BOOKINGS_VIEW,
      PERMISSIONS.BOOKINGS_CREATE,
      PERMISSIONS.BOOKINGS_EDIT,
      PERMISSIONS.BOOKINGS_CANCEL,
      PERMISSIONS.BOOKINGS_COMPLETE,
      PERMISSIONS.CONTENT_VIEW,
      PERMISSIONS.CONTENT_CREATE,
      PERMISSIONS.CONTENT_EDIT,
      PERMISSIONS.NEWSLETTER_VIEW,
      PERMISSIONS.SETTINGS_VIEW,
    ],
  },
  {
    slug: "accountant",
    name: "Accountant",
    description: "View booking values and customer records. No employee management.",
    permissions: [
      PERMISSIONS.DASHBOARD_OPERATIONAL,
      PERMISSIONS.CUSTOMERS_VIEW,
      PERMISSIONS.BOOKINGS_VIEW,
      PERMISSIONS.FINANCE_VIEW,
    ],
  },
];

export function isPermission(value: string): value is Permission {
  return (ALL_PERMISSIONS as string[]).includes(value);
}
