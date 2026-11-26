import type {
  LoyaltyCard,
  LoyaltyProgram,
  LoyaltyProgramSettings,
  PublicLoyaltyInfo,
} from "../loyalty";
import {
  LoyaltyCardSchema,
  LoyaltyProgramSchema,
  PublicLoyaltyInfoSchema,
} from "../schemas/loyalty";

type Api = Record<string, unknown>;

export const mapLoyaltyProgramFromApi = (data: Api): LoyaltyProgram =>
  LoyaltyProgramSchema.parse({
    enabled: data.enabled,
    stampsRequired: data.stamps_required,
    reward: data.reward,
    backgroundColor: data.background_color ?? null,
    foregroundColor: data.foreground_color ?? null,
    labelColor: data.label_color ?? null,
    appleWalletAvailable: data.apple_wallet_available ?? false,
  });

export const mapLoyaltyProgramSettingsToApi = (settings: LoyaltyProgramSettings) => ({
  enabled: settings.enabled,
  stamps_required: settings.stampsRequired,
  reward: settings.reward,
  background_color: settings.backgroundColor,
  foreground_color: settings.foregroundColor,
  label_color: settings.labelColor,
});

export const mapLoyaltyCardFromApi = (data: Api): LoyaltyCard =>
  LoyaltyCardSchema.parse({
    serialNumber: data.serial_number,
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    stamps: data.stamps,
    stampsRequired: data.stamps_required,
    reward: data.reward,
    rewardReady: data.reward_ready,
    visits: (Array.isArray(data.visits) ? (data.visits as Api[]) : []).map((v) => ({
      visitDate: v.visit_date,
      service: v.service,
      redeemed: v.redeemed,
    })),
    passUrl: data.pass_url ?? null,
  });

export const mapPublicLoyaltyInfoFromApi = (data: Api): PublicLoyaltyInfo =>
  PublicLoyaltyInfoSchema.parse({
    enabled: data.enabled,
    stampsRequired: data.stamps_required,
    reward: data.reward,
    appleWalletAvailable: data.apple_wallet_available ?? false,
  });
