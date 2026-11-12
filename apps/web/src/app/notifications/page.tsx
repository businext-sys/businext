"use client";

import React from "react";
import { BookingRequestList } from "@/components/booking-request/BookingRequestList";
import { ContentIdeasList } from "@/components/trends/ContentIdeasList";
import { useAccessContext } from "@/hooks/useAccessContext";
import { PageContainer, PageHeader } from "@/components/common/PageLayout";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const { capabilities } = useAccessContext();

  return (
    <PageContainer>
      <PageHeader
        icon={Bell}
        title="Notificaciones"
        description="Las solicitudes de reserva de tus clientes y las ideas de contenido nuevas"
      />

      {/* Booking requests section */}
      <section className="space-y-3">
        <h2 className="text-body font-semibold text-foreground">
          Solicitudes de reserva
        </h2>
        <BookingRequestList />
      </section>

      {capabilities.canViewTrends && (
        <section className="space-y-3">
          <h2 className="text-body font-semibold text-foreground">
            Ideas de contenido
          </h2>
          <ContentIdeasList />
        </section>
      )}
    </PageContainer>
  );
}
