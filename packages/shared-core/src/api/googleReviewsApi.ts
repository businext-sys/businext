import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type {
  GoogleBusinessProfile,
  ReviewsPage,
  SyncResult,
  BusinessSummary,
} from "../google-reviews";
import {
  mapProfile,
  mapReview,
  mapSyncResult,
  mapBusinessSummary,
} from "../google-reviews";

const PROFILE_PATH = "/google-reviews/profile";

export type ReviewsQuery = {
  page: number;
  pageSize: number;
  sortOrder: string;
  ratingFilter?: number | null;
  searchQuery?: string;
};

function buildReviewsPath(query: ReviewsQuery): string {
  const params = new URLSearchParams({
    page: String(query.page),
    page_size: String(query.pageSize),
    sort: query.sortOrder,
  });
  if (query.ratingFilter) params.set("rating", String(query.ratingFilter));
  if (query.searchQuery) params.set("search", query.searchQuery);
  return `/google-reviews/reviews?${params.toString()}`;
}

export const googleReviewsApi = {
  profilePath: PROFILE_PATH,
  buildReviewsPath,

  getProfile: (client: ApiClient = apiClient): Promise<Record<string, unknown>> =>
    client.get<Record<string, unknown>>(PROFILE_PATH),

  mapProfile,

  getReviews: (
    query: ReviewsQuery,
    client: ApiClient = apiClient
  ): Promise<Record<string, unknown>> =>
    client.get<Record<string, unknown>>(buildReviewsPath(query)),

  mapReviewsPage(raw: Record<string, unknown>): ReviewsPage {
    return {
      items: ((raw.items as Record<string, unknown>[]) || []).map(mapReview),
      total: raw.total as number,
      page: raw.page as number,
      pageSize: raw.page_size as number,
      totalPages: raw.total_pages as number,
    };
  },

  submitUrl: async (
    url: string,
    client: ApiClient = apiClient
  ): Promise<
    | { ok: true; profile: GoogleBusinessProfile; raw: Record<string, unknown> }
    | { ok: false; error: string }
  > => {
    const response = await client.raw(PROFILE_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_url: url }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.error || "Error al vincular el negocio" };
    }
    return { ok: true, profile: mapProfile(data), raw: data };
  },

  sync: async (
    client: ApiClient = apiClient
  ): Promise<{ ok: true; result: SyncResult } | { ok: false; error: string }> => {
    const response = await client.raw("/google-reviews/sync", { method: "POST" });
    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.error || "Error al sincronizar reseñas" };
    }
    return { ok: true, result: mapSyncResult(data) };
  },

  generateResponse: async (
    reviewId: number,
    client: ApiClient = apiClient
  ): Promise<string | null> => {
    const response = await client.raw(
      `/google-reviews/reviews/generate-response?id=${reviewId}`,
      { method: "POST" }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.ai_generated_response as string;
  },

  generateSummary: async (
    client: ApiClient = apiClient
  ): Promise<BusinessSummary | null> => {
    const response = await client.raw("/google-reviews/summary", { method: "POST" });
    if (!response.ok) return null;
    const data = await response.json();
    return mapBusinessSummary(data);
  },
};
