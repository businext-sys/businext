import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const INTERESTS: Record<string, string> = {
  businext: "Businext completo (con web incluida)",
  web: "Solo la web",
};

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Solicitud no válida" }, { status: 400 });
  }

  // Honeypot: people never see this field, bots fill it. Answer as if it worked.
  if (clean(body.website, 200)) return NextResponse.json({ success: true });

  const name = clean(body.name, 120);
  const shop = clean(body.shop, 120);
  const contact = clean(body.contact, 160);
  const interest = INTERESTS[clean(body.interest, 20)] ?? INTERESTS.businext;
  if (!name || !shop || !contact) {
    return NextResponse.json({ error: "Faltan datos: nombre, barbería y un email o teléfono" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_BUSINEXT_USER,
      pass: process.env.GMAIL_BUSINEXT_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_BUSINEXT_USER,
      to: "greenfourtech@gmail.com",
      subject: `Whitelist Businext: ${shop}`,
      text: `Nombre: ${name}\nBarbería: ${shop}\nContacto: ${contact}\nLe interesa: ${interest}`,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "No se pudo enviar la solicitud" }, { status: 500 });
  }
}
