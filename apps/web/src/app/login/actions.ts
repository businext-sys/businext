"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

/**
 * Decide el destino tras el login segun el contexto de acceso del backend.
 * Un owner sin suscripcion activa (can_access_app=false) debe ir directo a
 * /payment; el resto, a /reservation. Antes se redirigia siempre a
 * /reservation y era el middleware quien rebotaba a /payment, lo que dejaba
 * la URL inconsistente (se veia el checkout bajo /reservation).
 */
async function resolvePostLoginPath(accessToken: string | undefined): Promise<string> {
  if (!accessToken || !API_BASE) return "/reservation";
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return "/reservation";
    const ctx = await res.json();
    const canAccess = ctx?.capabilities?.canAccessApp;
    // Solo los owners sin suscripcion terminan bloqueados en /payment.
    if (canAccess === false && ctx?.accountType === "owner") {
      return "/payment";
    }
    return "/reservation";
  } catch {
    // Backend inalcanzable (p. ej. cold start): no bloquear el login, el
    // middleware corregira el destino en la siguiente navegacion.
    return "/reservation";
  }
}

export async function login(state: { error: string }, formData: FormData) {
  "use server";
  const supabase = await createClient();

  const data = {
    email: (formData.get("email") as string).toString().trim(),
    password: (formData.get("password") as string).toString().trim(),
  };

  const { data: authData, error } = await supabase.auth.signInWithPassword(
    data
  );

  if (error) {
    return { error: "Usuario o contraseña incorrectos" };
  }

  const destination = await resolvePostLoginPath(
    authData.session?.access_token
  );

  revalidatePath("/", "layout");
  redirect(destination);
}

export async function signup(state: { error: string }, formData: FormData) {
  const email = (formData.get("email") || "").toString().trim();
  const password = (formData.get("password") || "").toString();
  const fullName = (formData.get("fullName") || "").toString().trim();

  // Validación de email
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { error: "Email inválido" };
  }

  // Validación avanzada de contraseña
  if (!password || password.length < 6) {
    return { error: "Contraseña inválida (mínimo 6 caracteres)" };
  }
  if (
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    return {
      error: "La contraseña debe contener mayúsculas, minúsculas y números",
    };
  }

  // Validación avanzada de nombre completo
  if (!fullName || fullName.length < 3) {
    return { error: "Nombre completo inválido (mínimo 3 caracteres)" };
  }
  if (/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(fullName)) {
    return { error: "El nombre completo no debe contener números ni símbolos" };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName }),
    });

    let data;
    if (response.headers.get("content-type")?.includes("application/json")) {
      data = await response.json();
    } else {
      data = { error: await response.text() };
    }

    if (!response.ok) {
      return { error: data.error || data.detail || "Error al crear la cuenta" };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error al crear la cuenta",
    };
  }

  revalidatePath("/", "layout");
  redirect("/login/verify");
}
