import type {
  LoyaltyCard,
  LoyaltyPassSent,
  LoyaltyProgram,
  LoyaltyProgramSettings,
  LoyaltyScanResult,
  PublicLoyaltyInfo,
} from "../loyalty";
import {
  LoyaltyCardSchema,
  LoyaltyPassSentSchema,
  LoyaltyProgramSchema,
  LoyaltyScanResultSchema,
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
    logoUrl: data.logo_url ?? null,
  });

export const mapLoyaltyProgramSettingsToApi = (settings: LoyaltyProgramSettings) => ({
  enabled: settings.enabled,
  stamps_required: settings.stampsRequired,
  reward: settings.reward,
  background_color: settings.backgroundColor,
  foreground_color: settings.foregroundColor,
  label_color: settings.labelColor,
});

const cardFields = (data: Api) => ({
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

export const mapLoyaltyCardFromApi = (data: Api): LoyaltyCard =>
  LoyaltyCardSchema.parse(cardFields(data));

export const mapLoyaltyScanResultFromApi = (data: Api): LoyaltyScanResult =>
  LoyaltyScanResultSchema.parse({
    ...cardFields(data),
    stampedToday: data.stamped_today ?? false,
    stampAdded: data.stamp_added ?? false,
  });

export const mapLoyaltyPassSentFromApi = (data: Api): LoyaltyPassSent =>
  LoyaltyPassSentSchema.parse({ sentTo: data.sent_to, passUrl: data.pass_url });

export const mapPublicLoyaltyInfoFromApi = (data: Api): PublicLoyaltyInfo =>
  PublicLoyaltyInfoSchema.parse({
    enabled: data.enabled,
    stampsRequired: data.stamps_required,
    reward: data.reward,
    appleWalletAvailable: data.apple_wallet_available ?? false,
  });
