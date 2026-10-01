import { useRouter } from "expo-router";
import { Plus, Search, Tag } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Badge, Card, EarTag, TopBar } from "@/components/ui";
import { C, F } from "@/constants/theme";
import { loadAnimals, useAnimals } from "@/lib/animals-store";
import { useAuth } from "@/lib/auth-context";

export default function AnimalsScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [q, setQ] = useState("");
  const animals = useAnimals();

  useEffect(() => {
    if (token) {
      loadAnimals(token).catch(() => {
        // Keep whatever is already in the store if the backend is unreachable.
      });
    }
  }, [token]);

  const filtered = animals.filter((z) => (z.ime + z.si_id).toLowerCase().includes(q.toLowerCase()));

  return (
    <SafeAreaView edges={["top"]} style={styles.root}>
      <TopBar
        title="Živali"
        right={
          <Pressable
            onPress={() => router.push("/animal/new")}
            hitSlop={8}
            style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
          >
            <Plus size={18} color={C.paper} />
          </Pressable>
        }
      />
      <View style={styles.content}>
        <View style={styles.searchBox}>
          <Search size={15} color={C.faint} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Išči po imenu ali ušesni znamki…"
            placeholderTextColor={C.faint}
            style={styles.searchInput}
          />
        </View>
        <FlatList
          data={filtered}
          keyExtractor={(z) => String(z.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: z }) => (
            <Card onPress={() => router.push({ pathname: "/animal/[id]", params: { id: z.id } })}>
              <View style={styles.itemRow}>
                <View style={styles.itemLeft}>
                  <View style={styles.avatar}>
                    <Tag size={16} color={C.green} />
                  </View>
                  <View style={styles.nameCol}>
                    <Text style={styles.name}>{z.ime}</Text>
                    <EarTag>{z.si_id}</EarTag>
                  </View>
                </View>
                <View style={styles.itemRight}>
                  <Badge status={z.status} />
                  <Text style={styles.breed}>{z.pasma}</Text>
                </View>
              </View>
            </Card>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.green,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: F.sans,
    color: C.ink,
  },
  list: {
    gap: 8,
    paddingBottom: 24,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.mist,
    alignItems: "center",
    justifyContent: "center",
  },
  nameCol: {
    gap: 2,
  },
  name: {
    color: C.ink,
    fontSize: 14,
    fontFamily: F.sansMedium,
  },
  itemRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  breed: {
    color: C.faint,
    fontSize: 11,
    fontFamily: F.sans,
  },
});
