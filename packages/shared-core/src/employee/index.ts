import type { EmployeeParsed } from "../schemas/employee";

export type EmployeeRole = "employee" | "manager";
export type AccessRole = EmployeeRole | "owner";

export type Employee = EmployeeParsed;

export type InviteEmployeeInput = {
  displayName: string;
  email: string;
  phone: string;
  role: EmployeeRole;
};

export type UserAccessContext = {
  userId: string;
  businessId: string;
  role: AccessRole;
  accountType: "owner" | "member";
  memberStatus: string | null;
};
