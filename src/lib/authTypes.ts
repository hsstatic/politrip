export type UserKind = "customer" | "employee" | "owner";
export type UserStatus = "active" | "disabled" | "deactivated";

export type PublicUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl?: string;
  address?: string;
  city?: string;
  country?: string;
  kind: UserKind;
  employeeRoleId?: string;
  status: UserStatus;
  createdAt: number;
  updatedAt: number;
  lastLoginAt?: number;
  deactivatedAt?: number;
};

export type AuthPayload = {
  user: PublicUser;
  permissions: string[];
  roleName?: string;
  token: string;
  exp: number;
};
