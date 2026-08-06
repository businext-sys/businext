import { z } from "zod";

export const EmployeeRoleSchema = z.enum(["employee", "manager"]);
export const AccessRoleSchema = z.enum(["employee", "manager", "owner"]);

/** Schema de la forma "frontend" (camelCase) de un Employee. */
export const EmployeeSchema = z.object({
  id: z.number().optional(),
  businessId: z.string(),
  memberUserId: z.string(),
  displayName: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  role: AccessRoleSchema,
  status: z.string(),
  locationId: z.number().nullable().optional(),
  createdAt: z.string().optional(),
});

export type EmployeeParsed = z.infer<typeof EmployeeSchema>;
