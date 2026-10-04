import { useRouter } from "expo-router";
import {
  Baby,
  CalendarClock,
  HeartPulse,
  Milk,
  Plus,
  Syringe,
  Tag,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/screen";
import { Card, Empty, SectionLabel } from "@/components/ui";
import { C, F } from "@/constants/theme";
import { loadAnimals, useAnimals } from "@/lib/animals-store";
import * as api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { addEventPushListener } from "@/lib/notifications";
import { loadOpravila, type Opravilo } from "@/lib/tasks";

const DNEVI = ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"];
const MESECI = ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"];

function slovenianDate(date: Date) {
  return `${DNEVI[date.getDay()]}, ${date.getDate()}. ${MESECI[date.getMonth()]}`;
}

const pad = (n: number) => String(n).padStart(2, "0");
const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// Whole days between today and an event's date (negative = in the past).
function daysUntil(todayKey: string, datum: string): number {
  const ms = parseKey(datum).getTime() - parseKey(todayKey).getTime();
  return Math.round(ms / 86_400_000);
}

function whenLabel(days: number): string {
  if (days < 0) return `zamujeno ${-days} dni`;
  if (days === 0) return "danes";
  if (days === 1) return "jutri";
  return `čez ${days} dni`;
}

// Pick an icon for an event from its title (titles come from the calendar's fixed set).
function eventIcon(naslov: string): LucideIcon {
  const t = naslov.toLowerCase();
  if (t.includes("telitev")) return Baby;
  if (t.includes("pregled") || t.includes("vet")) return HeartPulse;
  if (t.includes("semen")) return Syringe;
  if (t.includes("premik")) return Truck;
  return CalendarClock;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const animals = useAnimals();
  const [profile, setProfile] = useState<api.Profile | null>(null);
  const [opravila, setOpravila] = useState<Opravilo[]>([]);

  useEffect(() => {
    if (!token) return;
    let active = true;

    loadAnimals(token).catch(() => {
      // Keep the current count if the backend is unreachable.
    });
    loadOpravila(token)
      .then((list) => {
        if (active) setOpravila(list);
      })
      .catch(() => {});
    api
      .getProfile(token)
      .then((p) => {
        if (active) setProfile(p);
      })
      .catch(() => {
        // Fall back to the cached auth user if the request fails.
      });

    return () => {
      active = false;
    };
  }, [token]);

  // Refresh tasks when another farm device pushes an event change (live sync).
  useEffect(() => {
    if (!token) return;
    return addEventPushListener(() => {
      loadOpravila(token).then(setOpravila).catch(() => {});
    });
  }, [token]);

  const todayKey = toKey(new Date());

  // Upcoming tasks (today onward), soonest first — drives both the stat and the alerts.
  const upcoming = useMemo(
    () => opravila.filter((o) => o.datum >= todayKey).sort((a, b) => a.datum.localeCompare(b.datum)),
    [opravila, todayKey],
  );
  const alerts = upcoming.slice(0, 4);

  const farm = profile?.farm;
  const farmName = farm?.name || profile?.name || user?.name || "Moja kmetija";
  const kmgMid = farm?.kmg_mid ?? user?.farm?.kmg_mid;
  const metaParts = [farm?.location || undefined, kmgMid ? `KMG-MID ${kmgMid}` : undefined].filter(Boolean);

  const actions: { label: string; icon: LucideIcon; onPress: () => void }[] = [
    { label: "Molža", icon: Milk, onPress: () => router.navigate("/milk") },
    { label: "Žival", icon: Plus, onPress: () => router.navigate("/animals") },
    { label: "Strošek", icon: Wallet, onPress: () => router.navigate("/finance") },
  ];

  return (
    <Screen title="Domov">
      <View style={styles.header}>
        <Text style={styles.date}>{slovenianDate(new Date())}</Text>
        <Text style={styles.farmName}>{farmName}</Text>
        {metaParts.length > 0 && <Text style={styles.farmMeta}>{metaParts.join(" · ")}</Text>}
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <Tag size={14} color={C.green} />
            <Text style={styles.statLabel}>ŽIVALI</Text>
          </View>
          <Text style={styles.statValue}>{animals.length}</Text>
        </Card>
        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <CalendarClock size={14} color={C.green} />
            <Text style={styles.statLabel}>OPRAVILA</Text>
          </View>
          <Text style={styles.statValue}>{upcoming.length}</Text>
        </Card>
      </View>

      <SectionLabel>Opozorila</SectionLabel>
      <View style={styles.list}>
        {alerts.length === 0 && <Empty text="Ni prihajajočih opravil." />}
        {alerts.map((o) => {
          const Icon = eventIcon(o.naslov);
          const days = daysUntil(todayKey, o.datum);
          const color = days <= 1 ? C.red : days <= 3 ? C.amber : C.soil;
          const subject = o.zivalIme ? `${o.zivalIme} — ` : "";
          return (
            <Card key={o.id} style={styles.alertCard}>
              <View style={styles.alertRow}>
                <Icon size={16} color={color} />
                <Text style={styles.alertText}>
                  {subject}
                  {o.naslov} · {whenLabel(days)}
                </Text>
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
