import { useRouter } from "expo-router";
import { Droplet, HeartPulse, Milk, Plus, Syringe, Tag, Wallet, type LucideIcon } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/screen";
import { Card, SectionLabel } from "@/components/ui";
import { FARM, MOLZENJA } from "@/constants/data";
import { C, F } from "@/constants/theme";
import { loadAnimals, useAnimals } from "@/lib/animals-store";
import { useAuth } from "@/lib/auth-context";

const DNEVI = ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"];
const MESECI = ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"];

function slovenianDate(date: Date) {
  return `${DNEVI[date.getDay()]}, ${date.getDate()}. ${MESECI[date.getMonth()]}`;
}

export default function HomeScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const animals = useAnimals();

  useEffect(() => {
    if (token) {
      loadAnimals(token).catch(() => {
        // Keep the current count if the backend is unreachable.
      });
    }
  }, [token]);

  const latestDay = MOLZENJA[0]?.datum;
  const todayMilk = MOLZENJA.filter((m) => m.datum === latestDay).reduce((a, b) => a + b.kolicina_mleka, 0);

  const alerts: { icon: LucideIcon; text: string; color: string }[] = [
    { icon: Syringe, text: "Mira — pregled brejosti čez 4 dni", color: C.amber },
    { icon: HeartPulse, text: "Roza — karenca za mleko do 8. 7.", color: C.red },
  ];

  const actions: { label: string; icon: LucideIcon; onPress: () => void }[] = [
    { label: "Molža", icon: Milk, onPress: () => router.navigate("/milk") },
    { label: "Žival", icon: Plus, onPress: () => router.navigate("/animals") },
    { label: "Strošek", icon: Wallet, onPress: () => router.navigate("/finance") },
  ];

  return (
    <Screen title="Domov">
      <View style={styles.header}>
        <Text style={styles.date}>{slovenianDate(new Date())}</Text>
        <Text style={styles.farmName}>{FARM.ime}</Text>
        <Text style={styles.farmMeta}>
          {FARM.lokacija} · KMG-MID {FARM.kmg_mid}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <Droplet size={14} color={C.green} />
            <Text style={styles.statLabel}>MLEKO DANES</Text>
          </View>
          <Text style={styles.statValue}>
            {todayMilk.toFixed(1)} <Text style={styles.statUnit}>L</Text>
          </Text>
        </Card>
        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <Tag size={14} color={C.green} />
            <Text style={styles.statLabel}>ŽIVALI</Text>
          </View>
          <Text style={styles.statValue}>{animals.length}</Text>
        </Card>
      </View>

      <SectionLabel>Opozorila</SectionLabel>
      <View style={styles.list}>
        {alerts.map((a, i) => {
          const Icon = a.icon;
          return (
            <Card key={i} style={styles.alertCard}>
              <View style={styles.alertRow}>
                <Icon size={16} color={a.color} />
                <Text style={styles.alertText}>{a.text}</Text>
              </View>
            </Card>
          );
        })}
      </View>

      <SectionLabel>Hitra dejanja</SectionLabel>
      <View style={styles.actionsRow}>
        {actions.map((b, i) => {
          const Icon = b.icon;
          return (
            <Pressable
              key={i}
              onPress={b.onPress}
              style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}
            >
              <Icon size={18} color={C.green} />
              <Text style={styles.actionLabel}>{b.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 4,
    paddingBottom: 16,
  },
  date: {
    color: C.soil,
    fontSize: 12,
    fontFamily: F.sansMedium,
  },
  farmName: {
    fontFamily: F.display,
    fontSize: 22,
    color: C.ink,
    marginTop: 2,
  },
  farmMeta: {
    color: C.muted,
    fontSize: 12,
    fontFamily: F.sans,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  statLabel: {
    color: C.green,
    fontSize: 11,
    fontFamily: F.sansSemiBold,
  },
  statValue: {
    fontFamily: F.display,
    fontSize: 24,
    color: C.ink,
  },
  statUnit: {
    fontSize: 13,
    fontFamily: F.sans,
  },
  list: {
    gap: 8,
  },
  alertCard: {
    borderColor: "#EADFCB",
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  alertText: {
    color: C.ink,
    fontSize: 13,
    fontFamily: F.sans,
    flexShrink: 1,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
  },
  actionPressed: {
    transform: [{ scale: 0.95 }],
  },
  actionLabel: {
    color: C.ink,
    fontSize: 11,
    fontFamily: F.sansMedium,
  },
});
