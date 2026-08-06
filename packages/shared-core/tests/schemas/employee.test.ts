import { describe, it, expect } from "vitest";
import { EmployeeSchema } from "../../src/schemas/employee";

describe("EmployeeSchema", () => {
  const valid = {
    id: 1,
    businessId: "biz-1",
    memberUserId: "user-1",
    displayName: "Ana",
    email: "ana@example.com",
    phone: "+573001234567",
    role: "employee",
    status: "active",
  };

  it("parsea un empleado valido", () => {
    expect(EmployeeSchema.parse(valid).role).toBe("employee");
  });

  it("acepta el rol owner", () => {
    expect(() =>
      EmployeeSchema.parse({ ...valid, role: "owner" })
    ).not.toThrow();
  });

  it("rechaza un rol fuera del enum", () => {
    expect(() =>
      EmployeeSchema.parse({ ...valid, role: "superadmin" })
    ).toThrow();
  });

  it("rechaza un empleado sin campos requeridos", () => {
    expect(() => EmployeeSchema.parse({ id: 1 })).toThrow();
  });
});
