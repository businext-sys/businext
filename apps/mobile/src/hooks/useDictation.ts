import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import { requireOptionalNativeModule } from "expo";
import type * as SpeechRecognition from "expo-speech-recognition";

// Un binario anterior a la versión con dictado no trae el módulo nativo: sin él, no hay micrófono.
const speech: typeof SpeechRecognition | null = requireOptionalNativeModule("ExpoSpeechRecognition")
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("expo-speech-recognition")
  : null;

export const dictationAvailable = speech !== null;

/**
 * Dictado con el reconocimiento de voz del sistema (es-ES, en el dispositivo
 * si lo admite). La transcripción llega en vivo y al parar se entrega a `onDone`.
 */
export function useDictation(onDone: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const transcriptRef = useRef("");
  const cancelledRef = useRef(false);
  const onDeviceRef = useRef(false);
  const retryOnlineRef = useRef(false);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const begin = useCallback((onDevice: boolean) => {
    if (!speech) return;
    onDeviceRef.current = onDevice;
    speech.ExpoSpeechRecognitionModule.start({
      lang: "es-ES",
      interimResults: true,
      continuous: true,
      addsPunctuation: true,
      requiresOnDeviceRecognition: onDevice,
      iosTaskHint: "dictation",
    });
  }, []);

  useEffect(() => {
    if (!speech) return;
    const recognizer = speech.ExpoSpeechRecognitionModule;
    const subscriptions = [
      recognizer.addListener("start", () => setListening(true)),
      recognizer.addListener("result", (event) => {
        const text = event.results[0]?.transcript ?? "";
        transcriptRef.current = text;
        setTranscript(text);
      }),
      recognizer.addListener("error", (event) => {
        if (event.error === "aborted" || event.error === "no-speech") return;
        if (
          onDeviceRef.current &&
          (event.error === "language-not-supported" || event.error === "service-not-allowed")
        ) {
          retryOnlineRef.current = true;
          return;
        }
        cancelledRef.current = true;
        if (event.error === "not-allowed") {
          Alert.alert("Sin permiso para el micrófono", "Actívalo en los ajustes del teléfono para dictar.");
        } else {
          Alert.alert("No te he entendido", "Vuelve a intentarlo o escribe el mensaje.");
        }
      }),
      recognizer.addListener("end", () => {
        if (retryOnlineRef.current) {
          retryOnlineRef.current = false;
          begin(false);
          return;
        }
        setListening(false);
        const text = transcriptRef.current.trim();
        transcriptRef.current = "";
        setTranscript("");
        if (!cancelledRef.current && text) onDoneRef.current(text);
      }),
    ];
    const cancelled = cancelledRef;
    return () => {
      cancelled.current = true;
      recognizer.abort();
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, [begin]);

  const start = useCallback(async () => {
    if (!speech || listening) return;
    const recognizer = speech.ExpoSpeechRecognitionModule;
    const permission = await recognizer.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Sin permiso para el micrófono", "Actívalo en los ajustes del teléfono para dictar.");
      return;
    }
    cancelledRef.current = false;
    transcriptRef.current = "";
    setTranscript("");
    setListening(true);
    begin(Platform.OS === "ios" && recognizer.supportsOnDeviceRecognition());
  }, [begin, listening]);

  const stop = useCallback(() => {
    speech?.ExpoSpeechRecognitionModule.stop();
  }, []);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    speech?.ExpoSpeechRecognitionModule.abort();
  }, []);

  return { available: dictationAvailable, listening, transcript, start, stop, cancel };
}
