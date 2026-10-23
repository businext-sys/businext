import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAccessContext } from "@businext/shared-core/hooks";
import { assistantChatEnabled, isAssistantChatEnabledFor } from "@/lib/featureFlags";
import { colors } from "@/theme/colors";
import AgendaScreen from "./AgendaScreen";
import ChatScreen from "./ChatScreen";

/**
 * Elige la home segun el flag del chat y el negocio piloto (issue #86).
 */
export default function HomeScreen() {
  const { context, loading } = useAccessContext({ enabled: assistantChatEnabled });

  if (!assistantChatEnabled) return <AgendaScreen />;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return isAssistantChatEnabledFor(context?.businessId) ? <ChatScreen /> : <AgendaScreen />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
