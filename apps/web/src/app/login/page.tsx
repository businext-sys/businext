"use client";

import { login, signup } from "@/app/login/actions";
import { useRef, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/common/BrandMark";

const INPUT_CLASS =
  "w-full rounded-sm border border-input bg-surface px-4 py-3 text-body text-foreground placeholder:text-foreground-subtle transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/25";

const LABEL_CLASS =
  "mb-1.5 block text-caption font-bold uppercase tracking-[0.1em] text-foreground-muted";

const ERROR_CLASS =
  "rounded-md border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-center text-body-sm text-danger";

const SUCCESS_CLASS =
  "rounded-md border border-success/30 bg-success/10 px-3.5 py-2.5 text-center text-body-sm text-success";

const PRIMARY_BUTTON_CLASS =
  "inline-flex w-full items-center justify-center gap-2.5 rounded-sm bg-primary px-8 py-3.5 text-body font-bold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60";

export default function LoginPage() {
  const [loginState,  loginAction,  loginPending]  = useActionState(login,  { error: "" });
  const [signupState, signupAction, signupPending] = useActionState(signup, { error: "" });
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryState, setRecoveryState] = useState<{ error?: string; success?: string }>({});
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const recoveryEmailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const formLoading = mode === "login" ? loginPending : signupPending;

  const handleSubmitAction = async (formData: FormData) => {
    if (mode === "login") await loginAction(formData);
    else await signupAction(formData);
  };

  async function handleRecovery(e: React.FormEvent) {
    e.preventDefault();
    setRecoveryLoading(true);
    setRecoveryState({});
    const email = recoveryEmailRef.current?.value.trim();
    if (!email) { setRecoveryState({ error: "Ingresa tu email" }); setRecoveryLoading(false); return; }
    try {
      const res  = await fetch("/api/recover-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (data.error) setRecoveryState({ error: data.error });
      else setRecoveryState({ success: "¡Correo enviado! Revisa tu bandeja de entrada." });
    } catch {
      setRecoveryState({ error: "Error de red. Intenta de nuevo." });
    } finally {
      setRecoveryLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-6">
      {/* Card */}
      <div className="w-full max-w-[440px] rounded-lg border border-border-subtle bg-surface px-[clamp(24px,6vw,44px)] py-[clamp(32px,7vw,52px)]">

        {/* Back button */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-7 inline-flex items-center gap-1.5 rounded-sm border border-border px-3.5 py-2 text-caption font-semibold tracking-wide text-foreground-muted transition-colors hover:border-foreground-subtle hover:text-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Volver
        </button>

        {/* Headline */}
        <div className="mb-8">
          <div className="mb-2.5 flex items-center gap-2">
            <BrandMark className="h-[22px] w-[27px] text-logo" />
            <p className="m-0 text-caption font-bold uppercase tracking-[0.18em] text-secondary">
              Businext
            </p>
          </div>
          <h1 className="m-0 font-heading text-[clamp(2.4rem,9vw,3.25rem)] font-black uppercase leading-[0.95] text-foreground">
            {mode === "login" ? (
              <>Bienvenido<br /><span className="text-primary">de vuelta.</span></>
            ) : (
              <>Crea tu<br /><span className="text-primary">cuenta.</span></>
            )}
          </h1>
        </div>

        {/* Recovery panel */}
        {showRecovery && (
          <div className="mb-6 flex flex-col gap-3 rounded-md border border-border-subtle bg-surface-raised p-5">
            <p className="m-0 text-body-sm font-bold text-foreground">Recuperar contraseña</p>
            {recoveryState.error   && <div className={ERROR_CLASS}>{recoveryState.error}</div>}
            {recoveryState.success && <div className={SUCCESS_CLASS}>{recoveryState.success}</div>}
            <input
              ref={recoveryEmailRef}
              type="email"
              placeholder="Tu correo electrónico"
              aria-label="Tu correo electrónico"
              className={INPUT_CLASS}
            />
            <button
              type="button"
              onClick={handleRecovery}
              disabled={recoveryLoading}
              className={PRIMARY_BUTTON_CLASS}
            >
              {recoveryLoading ? "Enviando..." : "Enviar correo de recuperación"}
            </button>
            <button type="button" onClick={() => setShowRecovery(false)} className="text-caption text-foreground-muted underline hover:text-foreground">
              Cerrar
            </button>
          </div>
        )}

        {/* Form errors */}
        {mode === "login"  && loginState?.error  && <div className={`${ERROR_CLASS} mb-4`}>{loginState.error}</div>}
        {mode === "signup" && signupState?.error  && <div className={`${ERROR_CLASS} mb-4`}>{signupState.error}</div>}

        {/* Form */}
        <form className="flex flex-col gap-[18px]" action={handleSubmitAction}>

          <div>
            <label htmlFor="email" className={LABEL_CLASS}>Email</label>
            <input
              id="email" name="email" type="email" required
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="password" className={LABEL_CLASS}>Contraseña</label>
            <input
              id="password" name="password" type="password" required
              placeholder="••••••••"
              autoComplete="current-password"
              className={INPUT_CLASS}
            />
            {mode === "login" && !showRecovery && (
              <button
                type="button"
                onClick={() => setShowRecovery(true)}
                className="float-right mt-2 p-0 text-caption text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </div>

          {mode === "signup" && (
            <div>
              <label htmlFor="fullName" className={LABEL_CLASS}>Nombre completo</label>
              <input
                id="fullName" name="fullName" type="text" required
                placeholder="Tu nombre completo"
                autoComplete="name"
                className={INPUT_CLASS}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={formLoading}
            className={`${PRIMARY_BUTTON_CLASS} mt-1.5`}
          >
            {formLoading
              ? (mode === "login" ? "Iniciando..." : "Creando...")
              : (mode === "login" ? "Iniciar sesión" : "Crear cuenta")}
            {!formLoading && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            )}
          </button>
        </form>

        {/* Mode toggle */}
        <p className="mt-6 text-center text-body-sm text-foreground-muted">
          {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="p-0 font-semibold text-primary hover:underline"
          >
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>

      </div>
    </div>
  );
}
