"use client";

import { Fragment, useState } from "react";
import { useGlobalToast } from "@/context/ToastContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  CalendarDays,
  ChartBarBig,
  Settings,
  LogOut,
  Menu,
  X,
  MessageCircleQuestion,
  Star,
  Users,
  TrendingUp,
  Bell,
  PhoneCall,
} from "lucide-react";
import { useAccessContext } from "@/hooks/useAccessContext";
import { useBookingRequests } from "@/hooks/useBookingRequests";
import { countNewSuggestions } from "@businext/shared-core/services";
import { useContentSuggestions } from "@/hooks/useTrends";
import { logout } from "@/app/login/logout";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/common/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalHeader, ModalContent, ModalFooter } from "@/components/ui/modal";

const NAV_GROUPS = [
  {
    label: "Día a día",
    links: [
      {
        href: "/reservation",
        label: "Reservas",
        icon: CalendarDays,
        cap: "canManageReservations" as const,
      },
      {
        href: "/clients",
        label: "Clientes",
        icon: Users,
        cap: "canManageReservations" as const,
        ownerOrManager: true,
      },
      {
        href: "/notifications",
        label: "Notificaciones",
        icon: Bell,
        cap: "canManageReservations" as const,
      },
    ],
  },
  {
    label: "Negocio",
    links: [
      {
        href: "/finances",
        label: "Finanzas",
        icon: ChartBarBig,
        cap: "canManageFinances" as const,
      },
      {
        href: "/reviews",
        label: "Reseñas",
        icon: Star,
        cap: "canManageReviews" as const,
      },
      {
        href: "/trends",
        label: "Tendencias",
        icon: TrendingUp,
        cap: "canViewTrends" as const,
      },
    ],
  },
  {
    label: "Asistente",
    links: [
      {
        href: "/voice-agent",
        label: "Agente de voz",
        icon: PhoneCall,
        cap: "canManageConfiguration" as const,
        ownerOnly: true,
      },
    ],
  },
  {
    label: "Ajustes",
    links: [
      {
        href: "/configuration",
        label: "Configuración",
        icon: Settings,
        cap: "canManageConfiguration" as const,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { context, capabilities } = useAccessContext();
  const { bookingRequests } = useBookingRequests();
  const { suggestions } = useContentSuggestions(undefined, capabilities.canViewTrends);
  const { showToast } = useGlobalToast();
  const [open, setOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [sending, setSending] = useState(false);

  const pendingCount = bookingRequests.filter(
    (r) => {
      if (r.status !== "REQUESTED") return false;
      if (context?.role === "owner") return true;
      const name = context?.profile?.displayName ?? context?.profile?.email ?? "";
      if (!r.employeeName) return true;
      return r.employeeName.toLowerCase() === name.toLowerCase();
    }
  ).length;
  const newIdeasCount = countNewSuggestions(suggestions);
  const notificationsCount = pendingCount + newIdeasCount;

  const displayName =
    context?.profile?.displayName ||
    context?.profile?.email ||
    "Usuario";

  const roleLabel =
    context?.role === "owner"
      ? "Owner"
      : context?.role === "manager"
      ? "Manager"
      : "Empleado";

  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    links: group.links.filter((link) => {
      if (!capabilities[link.cap]) return false;
      if ("ownerOnly" in link && context?.role !== "owner") return false;
      if ("ownerOrManager" in link && context?.role !== "owner" && context?.role !== "manager") return false;
      return true;
    }),
  })).filter((group) => group.links.length > 0);
  const activeLink = visibleGroups
    .flatMap((group) => group.links)
    .find((link) => pathname.startsWith(link.href));

  const sendContactEmail = async () => {
    setSending(true);
    try {
      await fetch("/api/send-contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: contactMessage }),
      });
      showToast("success", "¡Mensaje enviado!");
      setContactMessage("");
      setShowContact(false);
    } catch {
      showToast("error", "Error al enviar el mensaje. Intenta de nuevo.");
    }
    setSending(false);
  };

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-border-subtle">
        <BrandMark className="h-7 w-[35px] shrink-0 text-logo" />
        <span className="font-heading text-h3 font-black uppercase text-foreground select-none">
          Businext
        </span>
        <button
          type="button"
          onClick={() => setShowContact(true)}
          className="-my-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-foreground-muted transition-colors duration-150 ease-snappy hover:bg-surface-raised hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          title="Enviar dudas o quejas"
        >
          <MessageCircleQuestion className="h-5 w-5" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-4">
        {visibleGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <p className="px-4 text-caption font-bold uppercase tracking-[0.1em] text-foreground-subtle">
              {group.label}
            </p>
            {group.links.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              const badge = href === "/notifications" ? notificationsCount : 0;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-3 px-4 py-2.5 rounded-lg text-body-sm font-medium transition-all duration-150 ease-snappy",
                    active
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-foreground-muted hover:bg-surface-raised hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {label}
                  {badge > 0 && (
                    <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-danger-foreground bg-danger rounded-full">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-border-subtle flex flex-col gap-2">
        <div className="px-4 py-2 rounded-lg bg-surface-raised">
          <p className="text-body-sm font-semibold text-foreground truncate">
            {displayName}
          </p>
          <p className="text-caption text-foreground-muted">{roleLabel}</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-body-sm font-medium text-danger transition-colors duration-150 ease-snappy hover:bg-danger/10"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-surface border-r border-border-subtle fixed top-0 left-0 h-full z-30">
        {navContent}
      </aside>

      {/* Mobile: top bar with the current section */}
      <header className="md:hidden fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-2 border-b border-border-subtle bg-surface px-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors duration-150 ease-snappy hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
          {notificationsCount > 0 && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
          )}
        </button>
        {activeLink && (
          <span className="flex min-w-0 items-center gap-2 font-heading text-h4 font-bold text-foreground">
            <activeLink.icon className="h-5 w-5 shrink-0 text-primary" />
            <span className="truncate">{activeLink.label}</span>
          </span>
        )}
        <BrandMark className="ml-auto mr-2 h-6 w-[30px] shrink-0 text-logo" />
      </header>

      {/* Mobile: sliding sidebar via Headless UI Dialog */}
      <Transition show={open} as={Fragment}>
        <Dialog onClose={() => setOpen(false)} className="relative z-50 md:hidden">
          {/* Backdrop */}
          <TransitionChild
            as={Fragment}
            enter="ease-fluid duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-snappy duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-background/80" aria-hidden="true" />
          </TransitionChild>

          {/* Sliding panel */}
          <div className="fixed inset-y-0 left-0 flex">
            <TransitionChild
              as={Fragment}
              enter="ease-fluid duration-250"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="ease-snappy duration-200"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="w-72 bg-surface shadow-lg flex flex-col">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute top-2.5 right-2 flex h-11 w-11 items-center justify-center rounded-md text-foreground-muted transition-colors duration-150 ease-snappy hover:bg-surface-raised hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
                {navContent}
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Contact modal */}
      <Modal open={showContact} onClose={() => setShowContact(false)}>
        <ModalHeader onClose={() => setShowContact(false)}>
          Enviar dudas o quejas
        </ModalHeader>
        <ModalContent>
          <p className="text-body-sm text-foreground-muted mb-4">
            ¿Tienes alguna duda, sugerencia o queja? Escríbenos aquí:
          </p>
          <textarea
            className="flex w-full min-h-[80px] rounded-md border border-input bg-surface px-3 py-2 text-body-sm text-foreground placeholder:text-foreground-subtle transition-colors duration-150 ease-snappy focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Escribe tu mensaje..."
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            disabled={sending}
          />
        </ModalContent>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => setShowContact(false)}
            disabled={sending}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={sendContactEmail}
            disabled={sending || !contactMessage.trim()}
            loading={sending}
          >
            Enviar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
