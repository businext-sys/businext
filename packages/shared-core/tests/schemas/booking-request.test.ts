import { describe, it, expect } from "vitest";
import {
  BookingRequestSchema,
  BookingRequestCreateSchema,
} from "../../src/schemas/booking-request";

describe("BookingRequestSchema", () => {
  const valid = {
    id: 1,
    businessId: "biz-1",
    clientName: "Ana",
    clientEmail: "ana@example.com",
    clientPhone: "+573001234567",
    employeeName: null,
    service: "Corte de cabello",
    requestedDate: "2026-08-01T10:00:00Z",
    status: "REQUESTED",
    expiresAt: "2026-08-01T12:00:00Z",
    createdAt: "2026-08-01T09:00:00Z",
  };

  it("parsea un booking request valido", () => {
    expect(BookingRequestSchema.parse(valid).status).toBe("REQUESTED");
  });

  it("rechaza un status fuera del enum", () => {
    expect(() =>
      BookingRequestSchema.parse({ ...valid, status: "UNKNOWN" })
    ).toThrow();
  });

  it("rechaza un booking request sin campos requeridos", () => {
    expect(() => BookingRequestSchema.parse({ id: 1 })).toThrow();
  });
});

describe("BookingRequestCreateSchema", () => {
  it("parsea un create valido (snake_case)", () => {
    const valid = {
      client_name: "Ana",
      client_email: "ana@example.com",
      client_phone: "+573001234567",
      service: "Corte de cabello",
      requested_date: "2026-08-01T10:00:00Z",
    };
    expect(() => BookingRequestCreateSchema.parse(valid)).not.toThrow();
  });

  it("rechaza un create sin campos requeridos", () => {
    expect(() => BookingRequestCreateSchema.parse({})).toThrow();
  });
});
