import type { Employee } from "../employee";
import { EmployeeSchema } from "../schemas/employee";
import type { components } from "../api/generated-types";

/**
 * Verificado contra el OpenAPI real del backend (issue #018): a diferencia
 * de la mayoria de entidades (que usan snake_case), `EmployeePublic` /
 * `UpdateEmployeeInput` / `InviteEmployeeInput` en businext-backend YA
 * usan camelCase (`businessId`, `memberUserId`, `displayName`,
 * `locationId`, `createdAt`). Este mapper se corrigio para reflejar eso —
 * antes (issue #015) asumia snake_case sin verificar contra el contrato
 * real, por eso no se conecto a `useEmployee.ts` hasta ahora.
 */
export type EmployeeApiShape = components["schemas"]["EmployeePublic"];

export const mapEmployeeFromApi = (data: Record<string, unknown>): Employee => {
  const parsed = EmployeeSchema.parse({
    id: data.id,
    businessId: data.businessId,
    memberUserId: data.memberUserId,
    displayName: (data.displayName as string) ?? null,
    email: (data.email as string) ?? null,
    phone: (data.phone as string) ?? null,
    role: data.role,
    status: data.status,
    locationId: (data.locationId as number) ?? null,
    createdAt: data.createdAt as string | undefined,
  });
  return parsed;
};

export const mapEmployeeToApi = (employee: Employee) => ({
  id: employee.id,
  businessId: employee.businessId,
  memberUserId: employee.memberUserId,
  displayName: employee.displayName,
  email: employee.email,
  phone: employee.phone,
  role: employee.role,
  status: employee.status,
  locationId: employee.locationId ?? null,
  createdAt: employee.createdAt,
});
