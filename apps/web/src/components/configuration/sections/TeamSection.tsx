"use client";

import React, { useEffect, useState } from "react";
import { CalendarClock, Percent, ShieldUser, Trash2, UserPlus, Users } from "lucide-react";
import type { SettingsBlockId } from "@businext/shared-core/services";
import { useWorkingHours } from "@/hooks/useWorkingHours";
import { useLocations } from "@/hooks/useLocations";
import { useConfiguration } from "@/hooks/useConfiguration";
import { useGlobalToast } from "@/context/ToastContext";
import { Employee, InviteEmployeeInput } from "@/lib/employee/types";
import { WorkingHoursEditor } from "@/components/configuration/WorkingHoursEditor";
import { MoreOptions, SettingsCard } from "@/components/configuration/SettingsCard";
import { TeamAnalysis } from "@/components/intelligence/TeamAnalysis";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { InitialsAvatar } from "@/components/common/InitialsAvatar";
import { Modal, ModalHeader, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

const LABEL = "text-label font-semibold text-foreground-muted";

/** «Equipo y horarios»: horario del negocio, el equipo (con su horario) y las comisiones. */
export function TeamSection({ blocks }: { blocks: SettingsBlockId[] }) {
  const { workingHoursData, loading, updateWorkingHours } = useWorkingHours();
  return (
    <>
      {blocks.includes("businessHours") && (
        <div id="bloque-businessHours" className="scroll-mt-24">
          <WorkingHoursEditor
            workingHoursData={workingHoursData}
            loading={loading}
            onSave={updateWorkingHours}
            title="Horario del negocio"
            description="Los días y horas en que abres. Cada persona del equipo puede tener el suyo."
          />
        </div>
      )}
      {blocks.includes("team") && <TeamCard />}
      {blocks.includes("commissions") && <CommissionsCard />}
    </>
  );
}

const INITIAL_EMPLOYEE_FORM: InviteEmployeeInput = {
  displayName: "",
  email: "",
  phone: "",
  role: "employee",
};

function TeamCard() {
  const { locations } = useLocations();
  const { showToast } = useGlobalToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [form, setForm] = useState<InviteEmployeeInput>(INITIAL_EMPLOYEE_FORM);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [scheduleEmployee, setScheduleEmployee] = useState<Employee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    workingHoursData: empHours,
    loading: empHoursLoading,
    updateWorkingHours: updateEmpHours,
  } = useWorkingHours(scheduleEmployee?.memberUserId ?? undefined, !!scheduleEmployee);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/personal-management", { cache: "no-store" });
        if (response.status === 403) {
          setEmployees([]);
          return;
        }
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "No se pudo cargar el equipo");
        }
        setEmployees((await response.json()) as Employee[]);
      } catch (error) {
        showToast("error", error instanceof Error ? error.message : "No se pudo cargar el equipo");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async (
    memberUserId: string,
    field: "role" | "status" | "locationId",
    value: string
  ) => {
    const snapshot = employees;
    const parsedValue = field === "locationId" ? (value ? Number(value) : null) : value;
    setEmployees((prev) =>
      prev.map((e) => (e.memberUserId === memberUserId ? { ...e, [field]: parsedValue } : e))
    );
    setUpdatingId(memberUserId);
    try {
      const response = await fetch(`/api/personal-management?memberUserId=${memberUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: parsedValue }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "No se pudo actualizar");
      }
      const updated = (await response.json()) as Employee;
      setEmployees((prev) => prev.map((e) => (e.memberUserId === memberUserId ? updated : e)));
      showToast("success", "Cambios guardados.");
    } catch (error) {
      setEmployees(snapshot);
      showToast("error", error instanceof Error ? error.message : "No se pudo actualizar");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (memberUserId: string) => {
    setDeleteId(null);
    const snapshot = employees;
    setEmployees((prev) => prev.filter((e) => e.memberUserId !== memberUserId));
    try {
      const response = await fetch(`/api/personal-management?memberUserId=${memberUserId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "No se pudo quitar a la persona");
      }
      showToast("success", "Persona quitada del equipo.");
    } catch (error) {
      setEmployees(snapshot);
      showToast("error", error instanceof Error ? error.message : "No se pudo quitar a la persona");
    }
  };

  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSendingInvite(true);
    try {
      const response = await fetch("/api/personal-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo enviar la invitación");
      setEmployees(data.employees ?? []);
      setForm(INITIAL_EMPLOYEE_FORM);
      setInviteOpen(false);
      showToast("success", "Invitación enviada.");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "No se pudo enviar la invitación");
    } finally {
      setSendingInvite(false);
    }
  };

  return (
    <SettingsCard
      id="team"
      icon={ShieldUser}
      title="Tu equipo"
      description="Quién trabaja contigo y qué puede ver: los empleados ven su agenda; los encargados, además, el negocio."
      action={
        !inviteOpen && (
          <Button variant="primary" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Invitar a alguien
          </Button>
        )
      }
    >
      {inviteOpen && (
        <form
          className="grid grid-cols-1 gap-4 rounded-lg border border-border-subtle p-4 md:grid-cols-2"
          onSubmit={handleInvite}
        >
          <div className="space-y-1.5">
            <label htmlFor="inviteName" className={LABEL}>
              Nombre
            </label>
            <Input
              id="inviteName"
              value={form.displayName}
              onChange={(e) => setForm((c) => ({ ...c, displayName: e.target.value }))}
              placeholder="Nombre"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="inviteEmail" className={LABEL}>
              Email
            </label>
            <Input
              id="inviteEmail"
              type="email"
              value={form.email}
              onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
              placeholder="nombre@email.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="invitePhone" className={LABEL}>
              Teléfono
            </label>
            <Input
              id="invitePhone"
              value={form.phone}
              onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))}
              placeholder="+34 612 345 678"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="inviteRole" className={LABEL}>
              Rol
            </label>
            <Select
              id="inviteRole"
              value={form.role}
              onChange={(e) =>
                setForm((c) => ({ ...c, role: e.target.value as InviteEmployeeInput["role"] }))
              }
            >
              <option value="employee">Empleado</option>
              <option value="manager">Encargado</option>
            </Select>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">
            <Button type="submit" variant="primary" loading={sendingInvite}>
              Enviar invitación
            </Button>
            <Button type="button" variant="secondary" onClick={() => setInviteOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-body-sm text-foreground-muted">Cargando equipo...</p>
      ) : employees.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title="Aún no hay nadie en tu equipo"
          description="Invita a quien trabaja contigo para que vea su agenda y sus comisiones."
        />
      ) : (
        <ul className="space-y-2">
          {employees.map((employee) => {
            const busy = updatingId === employee.memberUserId;
            const isOwner = employee.role === "owner";
            return (
              <li
                key={employee.memberUserId}
                className="flex flex-col gap-3 rounded-md border border-border-subtle p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <InitialsAvatar
                    name={employee.displayName || employee.email || "?"}
                    className="h-9 w-9 shrink-0 bg-surface-raised text-caption"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-body-sm font-semibold text-foreground">
                      {employee.displayName || employee.email || employee.memberUserId}
                    </p>
                    <p className="truncate text-caption text-foreground-muted">
                      {employee.email}
                      {employee.phone && ` · ${employee.phone}`}
                    </p>
                  </div>
                  {employee.status === "pending" && <Badge variant="muted">Invitación enviada</Badge>}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-body-sm">
                  <Select
                    aria-label="Rol"
                    value={employee.role}
                    disabled={busy || isOwner}
                    onChange={(e) => handleUpdate(employee.memberUserId, "role", e.target.value)}
                    className="w-auto"
                  >
                    {isOwner && <option value="owner">Dueño</option>}
                    <option value="employee">Empleado</option>
                    <option value="manager">Encargado</option>
                  </Select>
                  <Select
                    aria-label="Estado"
                    value={employee.status}
                    disabled={busy || employee.status === "pending" || isOwner}
                    onChange={(e) => handleUpdate(employee.memberUserId, "status", e.target.value)}
                    className="w-auto"
                    state={employee.status === "inactive" ? "error" : "default"}
                  >
                    {employee.status === "pending" && <option value="pending">Pendiente</option>}
                    <option value="active">Activo</option>
                    <option value="inactive">Sin acceso</option>
                  </Select>
                  {locations.length > 0 && (
                    <Select
                      aria-label="Local"
                      value={String(employee.locationId ?? "")}
                      disabled={busy}
                      onChange={(e) => handleUpdate(employee.memberUserId, "locationId", e.target.value)}
                      className="w-auto"
                    >
                      <option value="">Sin local</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={String(loc.id)}>
                          {loc.name}
                        </option>
                      ))}
                    </Select>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setScheduleEmployee(employee)}
                    disabled={busy}
                    title="Horario propio"
                    aria-label={`Horario de ${employee.displayName || employee.email}`}
                  >
                    <CalendarClock className="h-4 w-4" />
                  </Button>
                  {!isOwner && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(employee.memberUserId)}
                      disabled={busy}
                      title="Quitar del equipo"
                      aria-label={`Quitar a ${employee.displayName || employee.email}`}
                      className="text-danger hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <MoreOptions label="Ver cómo rinde el equipo">
        <TeamAnalysis />
      </MoreOptions>

      <ConfirmDialog
        open={deleteId !== null}
        title="¿Quitar a esta persona del equipo?"
        description="Perderá el acceso a Businext. No se puede deshacer."
        destructive
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />

      <Modal open={!!scheduleEmployee} onClose={() => setScheduleEmployee(null)}>
        <ModalHeader onClose={() => setScheduleEmployee(null)}>
          Horario de {scheduleEmployee?.displayName || scheduleEmployee?.email}
        </ModalHeader>
        <ModalContent>
          <WorkingHoursEditor
            workingHoursData={empHours}
            loading={empHoursLoading}
            onSave={updateEmpHours}
            title="Horario propio"
            description="Si no lo cambias, usa el horario del negocio."
          />
        </ModalContent>
      </Modal>
    </SettingsCard>
  );
}

const normalizeCommission = (value: number) => Math.min(100, Math.max(0, value));

/** Porcentaje que se lleva quien vende un producto o hace un servicio. Antes estaba en Productos. */
function CommissionsCard() {
  const { configurationData, updateConfiguration, createConfiguration } = useConfiguration();
  const { showToast } = useGlobalToast();
  const current = configurationData[0];
  const [product, setProduct] = useState(0);
  const [service, setService] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (current) {
      setProduct(current.commissionProduct ?? 0);
      setService(current.commissionService ?? 0);
    }
  }, [current]);

  const save = async () => {
    setSaving(true);
    const payload = {
      businessName: current?.businessName,
      businessPhone: current?.businessPhone,
      businessEmail: current?.businessEmail,
      commissionProduct: normalizeCommission(product),
      commissionService: normalizeCommission(service),
    };
    const result = current
      ? await updateConfiguration({ id: current.id, ...payload })
      : await createConfiguration(payload);
    setSaving(false);
    showToast(
      result !== null ? "success" : "error",
      result !== null ? "Comisiones guardadas." : "No se pudieron guardar. Intenta de nuevo."
    );
  };

  return (
    <SettingsCard
      id="commissions"
      icon={Percent}
      title="Comisiones"
      description="Lo que se lleva cada persona del equipo por lo que vende o hace. Sale en Finanzas."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="commissionService" className={LABEL}>
            Por cada servicio (%)
          </label>
          <Input
            id="commissionService"
            type="number"
            min={0}
            max={100}
            step={0.01}
            value={service}
            onChange={(e) => setService(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="commissionProduct" className={LABEL}>
            Por cada producto (%)
          </label>
          <Input
            id="commissionProduct"
            type="number"
            min={0}
            max={100}
            step={0.01}
            value={product}
            onChange={(e) => setProduct(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
      <Button variant="secondary" onClick={save} loading={saving}>
        Guardar comisiones
      </Button>
    </SettingsCard>
  );
}
