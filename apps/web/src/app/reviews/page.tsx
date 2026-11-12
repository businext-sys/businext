"use client";

import { useGoogleReviews } from "@/hooks/useGoogleReviews";
import { useAccessContext } from "@/hooks/useAccessContext";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { GoogleMapsUrlForm } from "@/components/reviews/GoogleMapsUrlForm";
import { BusinessProfileCard } from "@/components/reviews/BusinessProfileCard";
import { ReviewMetrics } from "@/components/reviews/ReviewMetrics";
import { ReviewCharts } from "@/components/reviews/ReviewCharts";
import { BusinessSummary } from "@/components/reviews/BusinessSummary";
import { ReviewList } from "@/components/reviews/ReviewList";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageContainer, PageHeader } from "@/components/common/PageLayout";
import { ShieldAlert, Star } from "lucide-react";

export default function ReviewsPage() {
  const { capabilities, loading: contextLoading } = useAccessContext();
  const {
    profile,
    profileLoading,
    profileError,
    submitUrl,
    submitting,
    submitError,
    syncReviews,
    syncing,
    syncError,
    reviewsData,
    reviewsLoading,
    ratingFilter,
    setRatingFilter,
    sortOrder,
    setSortOrder,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    generateResponse,
    generatingResponse,
    generateSummary,
    generatingSummary,
  } = useGoogleReviews();

  /* ── Loading state ── */
  if (contextLoading) {
    return (
      <PageContainer>
        <SectionSkeleton />
        <SectionSkeleton />
      </PageContainer>
    );
  }

  /* ── Access denied ── */
  if (!capabilities.canManageFinances) {
    return (
      <PageContainer>
        <EmptyState
          icon={<ShieldAlert />}
          title="Acceso restringido"
          description="No tienes permisos para ver las reseñas del negocio."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
        <PageHeader
          icon={Star}
          title="Reseñas"
          description="Estadísticas y gestión de las reseñas de tu negocio en Google Maps"
        />

        {/* Loading state */}
        {profileLoading && (
          <div className="space-y-8">
            <SectionSkeleton />
            <SectionSkeleton />
          </div>
        )}

        {/* Error state (not 404 - 404 means no profile yet) */}
        {profileError && profileError.message && !profileError.message.includes("404") && (
          <div className="bg-surface-raised rounded-2xl p-6 text-center space-y-3 shadow-sm">
            <p className="text-body-sm text-danger">Error al cargar datos</p>
            <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        )}

        {/* No profile - show URL form */}
        {!profileLoading && !profile && (
          <GoogleMapsUrlForm
            onSubmit={submitUrl}
            submitting={submitting}
            error={submitError}
          />
        )}

        {/* Profile exists - show dashboard */}
        {profile && (
          <div className="space-y-8">
            {/* Business header - full width */}
            <BusinessProfileCard
              profile={profile}
              onSync={syncReviews}
              syncing={syncing}
              syncError={syncError}
            />

            {/* Metrics + Charts row */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-5">
                <ReviewMetrics profile={profile} />
              </div>
              <div className="col-span-12 lg:col-span-7">
                <ReviewCharts reviews={reviewsData?.items || []} />
              </div>
            </div>

            {/* AI Summary banner - full width */}
            <BusinessSummary
              profile={profile}
              onGenerateSummary={generateSummary}
              generating={generatingSummary}
            />

            {/* Reviews list - full width */}
            <ReviewList
              reviewsData={reviewsData}
              reviewsLoading={reviewsLoading}
              ratingFilter={ratingFilter}
              setRatingFilter={setRatingFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              page={page}
              setPage={setPage}
              onGenerateResponse={generateResponse}
              generatingResponse={generatingResponse}
            />
          </div>
        )}
    </PageContainer>
  );
}
