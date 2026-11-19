import { Alert, Linking, Share } from "react-native";

export const WEB_URL = "https://businext.greenfourtech.com";

/** Enlace público de reservas del negocio, el mismo que enseña la web en Configuración. */
export function bookingUrl(businessId: string): string {
  return `${WEB_URL}/book/${businessId}`;
}

export async function shareBookingLink(businessId: string, businessName?: string) {
  const url = bookingUrl(businessId);
  await Share.share({
    message: `Reserva tu cita${businessName ? ` en ${businessName}` : ""}: ${url}`,
    url,
  }).catch(() => {});
}

function digits(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

async function open(url: string, fallback: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(fallback);
  }
}

export const contact = {
  call: (phone: string) => open(`tel:${digits(phone)}`, "No se ha podido abrir el teléfono."),
  whatsapp: (phone: string) => {
    const number = digits(phone).replace(/^\+/, "");
    const withPrefix = number.length === 9 ? `34${number}` : number;
    return open(`https://wa.me/${withPrefix}`, "No se ha podido abrir WhatsApp.");
  },
  email: (email: string) => open(`mailto:${email}`, "No se ha podido abrir el correo."),
};
