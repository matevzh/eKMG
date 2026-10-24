import { useLocalSearchParams, useRouter } from "expo-router";
import { Baby, CalendarClock, HeartPulse, Syringe, Tag, Trash2, Truck } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, EarTag, Empty, PillTabs, Row, SectionLabel, StatePicker, TopBar } from "@/components/ui";
import { EMPTY_DETAIL } from "@/constants/data";
import { C, F } from "@/constants/theme";
import { removeAnimal, updateAnimalState, useAnimals } from "@/lib/animals-store";
import { useAuth } from "@/lib/auth-context";
import { addEventPushListener } from "@/lib/notifications";
import { loadOpravila, type Opravilo } from "@/lib/tasks";

const MESECI = [
  "jan", "feb", "mar", "apr", "maj", "jun",
  "jul", "avg", "sep", "okt", "nov", "dec",
];

// Format a "YYYY-MM-DD" key as e.g. "5. mar 2026".
function fmtDate(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return `${d}. ${MESECI[m - 1]} ${y}`;
}

type DetailTab = "pregled" | "zdravje" | "osemenjevanje" | "premiki";

export default function AnimalDetailScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tab, setTab] = useState<DetailTab>("pregled");
  const [deleting, setDeleting] = useState(false);
  const [savingState, setSavingState] = useState(false);
  const [opravila, setOpravila] = useState<Opravilo[]>([]);
  const animals = useAnimals();

  const z = animals.find((a) => a.id === Number(id));
  const d = EMPTY_DETAIL;

  const animalId = z?.id;
  const todayKey = new Date().toISOString().slice(0, 10);

  // Load calendar events and keep only the ones tied to this animal, upcoming first.
  useEffect(() => {
    if (!token || animalId == null) return;
    const refresh = () => {
      loadOpravila(token)
        .then((all) => setOpravila(all.filter((o) => o.zivalId === animalId)))
        .catch(() => {});
    };
    refresh();
    // Refresh when another farm device pushes an event change (live sync).
    return addEventPushListener(refresh);
  }, [token, animalId]);

  const animalTasks = useMemo(
    () =>
      [...opravila].sort((a, b) => {
        const aUpcoming = a.datum >= todayKey;
        const bUpcoming = b.datum >= todayKey;
        if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;
        // Upcoming: soonest first. Past: most recent first.
        return aUpcoming ? a.datum.localeCompare(b.datum) : b.datum.localeCompare(a.datum);
      }),
    [opravila, todayKey],
  );

  function confirmDelete() {
    if (!z) return;
    Alert.alert(
      "Izbriši žival",
      `Ali res želiš izbrisati žival ${z.ime}? Tega dejanja ni mogoče razveljaviti.`,
      [
        { text: "Prekliči", style: "cancel" },
        { text: "Izbriši", style: "destructive", onPress: onDelete },
      ],
    );
  }

  async function onChangeState(state: "isLactating" | "isPregnant", value: boolean) {
    if (!z || savingState) return;
    if (!token) {
      Alert.alert("Seja je potekla", "Prijavi se znova.");
      return;
    }
    setSavingState(true);
    try {
      await updateAnimalState(token, z.id, { [state]: value });
    } catch (err) {
      Alert.alert("Napaka", err instanceof Error ? err.message : "Podatka ni bilo mogoče spremeniti.");
    } finally {
      setSavingState(false);
    }
  }

  async function onDelete() {
    if (!z || deleting) return;
    if (!token) {
      Alert.alert("Seja je potekla", "Prijavi se znova.");
      return;
    }
    setDeleting(true);
    try {
      await removeAnimal(token, z.id);
      router.back();
    } catch (err) {
      setDeleting(false);
      Alert.alert("Napaka", err instanceof Error ? err.message : "Žival ni bilo mogoče izbrisati.");
    }
  }

  if (!z) {
    return (
      <SafeAreaView edges={["top"]} style={styles.root}>
        <TopBar title="Žival" onBack={() => router.back()} />
        <View style={styles.content}>
          <Empty text="Žival ni bila najdena." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.root}>
      <TopBar
        title={z.ime}
        onBack={() => router.back()}
        right={
          <Pressable
            onPress={confirmDelete}
            disabled={deleting}
            hitSlop={8}
            style={({ pressed }) => [styles.deleteButton, pressed && styles.deletePressed]}
          >
            {deleting ? <ActivityIndicator size="small" color={C.red} /> : <Trash2 size={20} color={C.red} />}
          </Pressable>
        }
      />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Tag size={22} color={C.green} />
          </View>
          <View style={styles.nameCol}>
            <Text style={styles.name}>{z.ime}</Text>
            <EarTag size={11}>{z.si_id}</EarTag>
          </View>
          <View style={styles.stateControls}>
            <StatePicker
              label="Molznost"
              enabledLabel="Molzena"
              disabledLabel="Presušena"
              tone="green"
              value={z.isLactating}
              onChange={(value) => onChangeState("isLactating", value)}
              saving={savingState}
            />
            <StatePicker
              label="Brejost"
              enabledLabel="Breja"
              disabledLabel="Ni breja"
              tone="amber"
              value={z.isPregnant}
              onChange={(value) => onChangeState("isPregnant", value)}
              saving={savingState}
            />
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          <PillTabs
            tabs={[
              { key: "pregled", label: "Pregled" },
              { key: "zdravje", label: "Zdravje" },
              { key: "osemenjevanje", label: "Osemenjevanje" },
              { key: "premiki", label: "Premiki" },
            ]}
            active={tab}
            onChange={setTab}
          />
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === "pregled" && (
          <View style={styles.list}>
            <Card>
              <Row label="Pasma" value={z.pasma} />
              <Row label="Datum rojstva" value={z.datum_rojstva} />
              {/*<Row label="Laktacija" value={`#${z.laktacija}`} />*/}
            </Card>
            <SectionLabel>Opravila</SectionLabel>
            {animalTasks.length === 0 ? (
              <Empty text="Ni opravil za to žival." />
            ) : (
              animalTasks.map((o) => {
                const past = o.datum < todayKey;
                return (
                  <Card key={o.id}>
                    <View style={styles.eventHeader}>
                      <CalendarClock size={14} color={past ? C.faint : C.green} />
                      <Text style={styles.eventType}>{o.naslov}</Text>
                      <Text style={styles.eventDate}>{fmtDate(o.datum)}</Text>
                    </View>
                    {!!o.opomba && <Row label="Opomba" value={o.opomba} compact />}
                  </Card>
                );
              })
            )}
            <SectionLabel>Telitve</SectionLabel>
            {d.telitve.length === 0 ? (
              <Empty text="Ni zabeleženih telitev." />
            ) : (
              d.telitve.map((t, i) => (
                <Card key={i}>
                  <Row icon={Baby} label="Datum telitve" value={t.datum} />
                </Card>
              ))
            )}
          </View>
        )}

        {tab === "zdravje" && (
          <View style={styles.list}>
            <SectionLabel>Zdravstveni dogodki</SectionLabel>
            {d.zdravstveni_dogodki.length === 0 ? (
              <Empty text="Ni zabeleženih zdravstvenih dogodkov." />
            ) : (
              d.zdravstveni_dogodki.map((e, i) => (
                <Card key={i}>
                  <View style={styles.eventHeader}>
                    <HeartPulse size={14} color={C.red} />
                    <Text style={styles.eventType}>{e.tip}</Text>
                    <Text style={styles.eventDate}>{e.datum}</Text>
                  </View>
                  <Row label="Diagnoza" value={e.diagnoza} compact />
                  <Row label="Veterinar" value={e.ime_veterinarja} compact />
                </Card>
              ))
            )}
            <SectionLabel>Terapije</SectionLabel>
            {d.terapije.length === 0 ? (
              <Empty text="Ni zabeleženih terapij." />
            ) : (
              d.terapije.map((t, i) => (
                <Card key={i}>
                  <Row icon={Syringe} label="Doza" value={t.doza} compact />
                  <Row label="Karenca" value={t.karenca} compact />
                </Card>
              ))
            )}
          </View>
        )}

        {tab === "osemenjevanje" && (
          <View style={styles.list}>
            {d.osemenjevanja.length === 0 ? (
              <Empty text="Ni zabeleženih osemenjevanj." />
            ) : (
              d.osemenjevanja.map((o, i) => (
                <Card key={i}>
                  <Row label="Datum" value={o.datum} compact />
                  <Row label="Bik" value={o.ime_bika} compact />
                  <Row label="Rezultat" value={o.rezultat_brejosti} compact />
                </Card>
              ))
            )}
          </View>
        )}

        {tab === "premiki" && (
          <View style={styles.list}>
            {d.premiki.length === 0 ? (
              <Empty text="Ni zabeleženih premikov." />
            ) : (
              d.premiki.map((p, i) => (
                <Card key={i}>
                  <Row icon={Truck} label={p.tip_premika} value={p.datum} compact />
                </Card>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.mist,
    alignItems: "center",
    justifyContent: "center",
  },
  nameCol: {
    gap: 2,
  },
  name: {
    fontFamily: F.display,
    fontSize: 19,
    color: C.ink,
  },
  stateControls: {
    marginLeft: "auto",
    alignItems: "flex-end",
    gap: 6,
  },
  deleteButton: {
    padding: 4,
    borderRadius: 999,
  },
  deletePressed: {
    opacity: 0.6,
  },
  tabsScroll: {
    paddingBottom: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  list: {
    gap: 8,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  eventType: {
    color: C.ink,
    fontSize: 13,
    fontFamily: F.sansMedium,
  },
  eventDate: {
    color: C.faint,
    fontSize: 11,
    fontFamily: F.sans,
    marginLeft: "auto",
  },
});
