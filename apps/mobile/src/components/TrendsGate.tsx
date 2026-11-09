import type { ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { useAccessContext } from "@businext/shared-core/hooks";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

export function TrendsGate({ children }: { children: ReactNode }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { capabilities, loading } = useAccessContext();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!capabilities.canViewTrends) return <Redirect href="/" />;

  return <>{children}</>;
}

const useStyles = themedStyles((colors) => ({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
}));
