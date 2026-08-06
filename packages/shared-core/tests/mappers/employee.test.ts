import { describe, it, expect } from "vitest";
import { mapEmployeeFromApi, mapEmployeeToApi } from "../../src/mappers/employee";
import type { Employee } from "../../src/employee";

describe("mapEmployeeFromApi / mapEmployeeToApi", () => {
  const employee: Employee = {
    id: 1,
    businessId: "biz-1",
    memberUserId: "user-1",
    displayName: "Ana",
    email: "ana@example.com",
    phone: "+573001234567",
    role: "employee",
    status: "active",
    locationId: 2,
    createdAt: "2026-08-01T09:00:00Z",
  };

  it("mapea de API (snake_case) a frontend (camelCase)", () => {
    const raw = {
      id: 1,
      business_id: "biz-1",
      member_user_id: "user-1",
      display_name: "Ana",
      email: "ana@example.com",
      phone: "+573001234567",
      role: "employee",
      status: "active",
      location_id: 2,
      created_at: "2026-08-01T09:00:00Z",
    };
    expect(mapEmployeeFromApi(raw)).toEqual(employee);
  });

  it("round-trip: FromApi(ToApi(x)) == x", () => {
    expect(mapEmployeeFromApi(mapEmployeeToApi(employee))).toEqual(employee);
  });

  it("lanza si el rol no es valido", () => {
    expect(() =>
      mapEmployeeFromApi({ ...employee, role: "superadmin" })
    ).toThrow();
  });
});
