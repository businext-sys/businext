import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { themedStyles } from "@/theme/ThemeContext";
import { fonts } from "@/theme/fonts";

type Props = {
  businessName: string;
  onNewConversation: () => void;
  onOpenHistory: () => void;
};

export function ChatHeader({ businessName, onNewConversation, onOpenHistory }: Props) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <View style={styles.identity}>
        <Image
          source={require("../../../assets/avatar-asistente.png")}
          style={styles.avatar}
          accessibilityLabel="Avatar del asistente"
        />
        <View style={styles.names}>
          <Text style={styles.title} accessibilityRole="header" numberOfLines={1}>
            {businessName}
          </Text>
          <Text style={styles.subtitle}>Asistente</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <HeaderIconButton
          icon="time-outline"
          label="Historial de conversaciones"
          onPress={onOpenHistory}
          testID="chat-history-button"
        />
        <HeaderIconButton
          icon="create-outline"
          label="Nueva conversación"
          onPress={onNewConversation}
          testID="chat-new-button"
        />
      </View>
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  identity: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  names: { flex: 1 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  title: { fontFamily: fonts.bodyBold, fontSize: 17, color: colors.foreground },
  subtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.foregroundSubtle },
  actions: { flexDirection: "row", alignItems: "center" },
}));
