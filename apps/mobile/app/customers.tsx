import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { customersApi, type KnownCustomer } from "@businext/shared-core/api";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

/** Buscador de clientes (issue #218): abre la ficha de cada uno. */
export default function CustomersScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState<KnownCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setLoading(true);
      customersApi
        .search(query.trim(), 30)
        .then((found) => active && setCustomers(found))
        .catch(() => active && setCustomers([]))
        .finally(() => active && setLoading(false));
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <View style={styles.flex}>
      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.foregroundSubtle} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Nombre, teléfono o email"
          placeholderTextColor={colors.foregroundSubtle}
          autoCorrect={false}
          clearButtonMode="while-editing"
          accessibilityLabel="Buscar cliente"
        />
      </View>
      <FlatList
        data={customers}
        keyExtractor={(c) => `${c.name}-${c.phone ?? ""}-${c.email ?? ""}`}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => router.push({ pathname: "/customer", params: { name: item.name } })}
            accessibilityRole="button"
          >
            <View style={styles.avatar}>
              <Text style={styles.initial}>{item.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              {(item.phone || item.email) && (
                <Text style={styles.meta} numberOfLines={1}>
                  {item.phone ?? item.email}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.foregroundSubtle} />
          </Pressable>
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.primary} style={styles.loader} />
          ) : (
            <Text style={styles.empty}>
              {query ? "Ningún cliente coincide." : "Aún no hay clientes."}
            </Text>
          )
        }
      />
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  input: { flex: 1, minHeight: 44, fontSize: 16, color: colors.foreground },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { fontSize: 16, fontWeight: "700", color: colors.foreground },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 15, fontWeight: "600", color: colors.foreground },
  meta: { fontSize: 13, color: colors.foregroundMuted },
  loader: { marginTop: 24 },
  empty: { textAlign: "center", marginTop: 24, fontSize: 14, color: colors.foregroundMuted },
}));
