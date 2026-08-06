import type { Configuration } from "../configuration";
import { ConfigurationSchema } from "../schemas/configuration";

export const mapConfigurationFromApi = (
  data: Record<string, unknown>
): Configuration => {
  const parsed = ConfigurationSchema.parse({
    id: data.id,
    businessName: data.business_name,
    businessPhone: (data.business_phone as string) || undefined,
    businessEmail: (data.business_email as string) || undefined,
    commissionProduct:
      typeof data.commission_product === "number"
        ? (data.commission_product as number)
        : undefined,
    commissionService:
      typeof data.commission_service === "number"
        ? (data.commission_service as number)
        : undefined,
  });
  return parsed;
};

export const mapConfigurationToApi = (configuration: Configuration) => ({
  id: configuration.id,
  business_name: configuration.businessName,
  business_phone: configuration.businessPhone ?? null,
  business_email: configuration.businessEmail ?? null,
  commission_product: configuration.commissionProduct ?? null,
  commission_service: configuration.commissionService ?? null,
});
