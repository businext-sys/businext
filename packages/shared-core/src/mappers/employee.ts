import type { Employee } from "../employee";
import { EmployeeSchema } from "../schemas/employee";

export const mapEmployeeFromApi = (data: Record<string, unknown>): Employee => {
  const parsed = EmployeeSchema.parse({
    id: data.id,
    businessId: data.business_id,
    memberUserId: data.member_user_id,
    displayName: (data.display_name as string) ?? null,
    email: (data.email as string) ?? null,
    phone: (data.phone as string) ?? null,
    role: data.role,
    status: data.status,
    locationId: (data.location_id as number) ?? null,
    createdAt: data.created_at as string | undefined,
  });
  return parsed;
};

export const mapEmployeeToApi = (employee: Employee) => ({
  id: employee.id,
  business_id: employee.businessId,
  member_user_id: employee.memberUserId,
  display_name: employee.displayName,
  email: employee.email,
  phone: employee.phone,
  role: employee.role,
  status: employee.status,
  location_id: employee.locationId ?? null,
  created_at: employee.createdAt,
});
