"use client";
import { useState, useCallback } from "react";
import useSWR from "swr";
import type { GoogleBusinessProfile, ReviewsPage } from "../google-reviews";
import { googleReviewsApi } from "../api/googleReviewsApi";

export function useGoogleReviews() {
  // ── Profile ─────────────────────────────────────────────────────────
  const {
    data: rawProfile,
    isLoading: profileLoading,
    error: profileError,
    mutate: mutateProfile,
  } = useSWR<Record<string, unknown>>(
    googleReviewsApi.profilePath,
    () => googleReviewsApi.getProfile(),
    { shouldRetryOnError: false }
  );

  const profile: GoogleBusinessProfile | null =
    rawProfile && !("error" in rawProfile)
      ? googleReviewsApi.mapProfile(rawProfile)
      : null;

  // ── Reviews (paginated) ─────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const reviewsKey = profile
    ? googleReviewsApi.buildReviewsPath({ page, pageSize, sortOrder, ratingFilter, searchQuery })
    : null;

  const {
    data: rawReviews,
    isLoading: reviewsLoading,
    error: reviewsError,
    mutate: mutateReviews,
  } = useSWR<Record<string, unknown>>(reviewsKey, () =>
    googleReviewsApi.getReviews({ page, pageSize, sortOrder, ratingFilter, searchQuery })
  );

  const reviewsData: ReviewsPage | null = rawReviews
    ? googleReviewsApi.mapReviewsPage(rawReviews)
    : null;

  // ── Submit URL ──────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitUrl = useCallback(
    async (url: string) => {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const result = await googleReviewsApi.submitUrl(url);
        if (!result.ok) {
          setSubmitError(result.error);
          return null;
        }
        await mutateProfile(result.raw, { revalidate: false });
        return result.profile;
      } catch {
        setSubmitError("Error de conexión. Intenta de nuevo.");
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [mutateProfile]
  );

  // ── Sync Reviews ────────────────────────────────────────────────────
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const syncReviews = useCallback(async () => {
    setSyncing(true);
    setSyncError(null);
    try {
      const result = await googleReviewsApi.sync();
      if (!result.ok) {
        setSyncError(result.error);
        return null;
      }
      await mutateProfile();
      await mutateReviews();
      return result.result;
    } catch {
      setSyncError("Error al sincronizar reseñas");
      return null;
    } finally {
      setSyncing(false);
    }
  }, [mutateProfile, mutateReviews]);

  // ── Generate AI Response ────────────────────────────────────────────
  const [generatingResponse, setGeneratingResponse] = useState<number | null>(
    null
  );

  const generateResponse = useCallback(
    async (reviewId: number) => {
      setGeneratingResponse(reviewId);
      try {
        const result = await googleReviewsApi.generateResponse(reviewId);
        if (result !== null) await mutateReviews();
        return result;
      } catch {
        return null;
      } finally {
        setGeneratingResponse(null);
      }
    },
    [mutateReviews]
  );

  // ── Generate AI Summary ─────────────────────────────────────────────
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const generateSummary = useCallback(async () => {
    setGeneratingSummary(true);
    try {
      const result = await googleReviewsApi.generateSummary();
      if (result !== null) await mutateProfile();
      return result;
    } catch {
      return null;
    } finally {
      setGeneratingSummary(false);
    }
  }, [mutateProfile]);

  return {
    // Profile
    profile,
    profileLoading,
    profileError,
    // Reviews
    reviewsData,
    reviewsLoading,
    reviewsError,
    // Filter state
    page,
    setPage,
    ratingFilter,
    setRatingFilter,
    sortOrder,
    setSortOrder,
    searchQuery,
    setSearchQuery,
    // Actions
    submitUrl,
    submitting,
    submitError,
    syncReviews,
    syncing,
    syncError,
    generateResponse,
    generatingResponse,
    generateSummary,
    generatingSummary,
  };
}
