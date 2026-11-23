import { describe, it, expect } from "vitest";
import { expandInternalCards, parseConversation, readablePreview } from "../../src/assistant";

const confirmation = {
  type: "confirmation",
  action_id: "a-1",
  title: "Reservar a Ana",
  description: "Corte, mañana a las 10:00 {con} \"llaves\"",
  status: "pending",
};
const marker = (card: unknown) => `[tarjeta mostrada al usuario: ${JSON.stringify(card)}]`;

describe("tarjetas internas del historial", () => {
  it("convierte la tarjeta en un bloque y conserva el texto de alrededor", () => {
    expect(expandInternalCards(`Te la preparo.\n${marker(confirmation)}\n¿Confirmas?`)).toEqual([
      { type: "text", text: "Te la preparo." },
      confirmation,
      { type: "text", text: "¿Confirmas?" },
    ]);
  });

  it("nunca deja ver JSON ilegible o a medias", () => {
    expect(expandInternalCards("Hola [tarjeta mostrada al usuario: {\"type\": \"confirm")).toEqual([
      { type: "text", text: "Hola" },
    ]);
    expect(expandInternalCards(marker({ type: "desconocida" }))).toEqual([]);
  });

  it("parseConversation recupera la tarjeta pendiente de un mensaje anterior", () => {
    const conversation = parseConversation({
      id: "c-1",
      title: "Reserva",
      updated_at: "2026-11-18T10:00:00",
      messages: [
        {
          id: "m-1",
          conversation_id: "c-1",
          role: "assistant",
          created_at: "2026-11-18T10:00:00",
          blocks: [{ type: "text", text: marker(confirmation) }],
        },
      ],
    });
    expect(conversation.messages[0].blocks).toEqual([confirmation]);
  });

  it("readablePreview oculta la vista previa que solo es una tarjeta", () => {
    expect(readablePreview(marker(confirmation))).toBeNull();
    expect(readablePreview("Hecho. " + marker(confirmation))).toBe("Hecho.");
    expect(readablePreview(null)).toBeNull();
  });
});
