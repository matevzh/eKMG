import { useLocalSearchParams, useRouter } from "expo-router";
import { Baby, CalendarClock, Plus, Tag, Trash2, Truck } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Card,
  DateField,
  EarTag,
  Empty,
  PillTabs,
  Row,
  SectionLabel,
  SelectField,
  StatePicker,
  TextField,
  TopBar,
} from "@/components/ui";
import {
  animalSexLabel,
  CUSTOM_EVENT_TITLE,
  EMPTY_DETAIL,
  EVENT_TITLE_OPTIONS,
  isFemaleAnimal,
  isMaleAnimal,
} from "@/constants/data";
import { C, F } from "@/constants/theme";
import { removeAnimal, updateAnimalState, useAnimals } from "@/lib/animals-store";
import { useAuth } from "@/lib/auth-context";
import { addEventPushListener } from "@/lib/notifications";
import { syncNow } from "@/lib/sync/engine";
import { createOpravilo, loadOpravila, useOpravila } from "@/lib/tasks";

const MESECI = [
  "jan", "feb", "mar", "apr", "maj", "jun",
  "jul", "avg", "sep", "okt", "nov", "dec",
];

const pad = (n: number) => String(n).padStart(2, "0");

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Format a "YYYY-MM-DD" key as e.g. "5. mar 2026".
function fmtDate(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return `${d}. ${MESECI[m - 1]} ${y}`;
}

type DetailTab = "pregled" | "osemenjevanje" | "premiki";

export default function AnimalDetailScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tab, setTab] = useState<DetailTab>("pregled");
  const [deleting, setDeleting] = useState(false);
  const [savingState, setSavingState] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [naslov, setNaslov] = useState("");
  const [customNaslov, setCustomNaslov] = useState("");
  const [opomba, setOpomba] = useState("");
  const [datum, setDatum] = useState(todayKey);
  const [reminderDate, setReminderDate] = useState(todayKey);
  const [savingEvent, setSavingEvent] = useState(false);
  const animals = useAnimals();
  const allOpravila = useOpravila();

  const z = animals.find((a) => a.id === Number(id));
  const d = EMPTY_DETAIL;
  const female = isFemaleAnimal(z?.gender);
  const male = isMaleAnimal(z?.gender);
  const sexLabel = animalSexLabel(z?.gender);

  const animalId = z?.id;
  const dayKey = todayKey();

  useEffect(() => {
    if (!token) return;
    loadOpravila(token).catch(() => {});
    return addEventPushListener(() => {
      void syncNow();
    });
  }, [token]);

  const animalTasks = useMemo(() => {
    const linked = allOpravila.filter((o) => o.zivalId === animalId);
    return [...linked].sort((a, b) => {
      const aUpcoming = a.datum >= dayKey;
      const bUpcoming = b.datum >= dayKey;
      if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;
      // Upcoming: soonest first. Past: most recent first.
      return aUpcoming ? a.datum.localeCompare(b.datum) : b.datum.localeCompare(a.datum);
    });
  }, [allOpravila, animalId, dayKey]);

  const resolvedTitle = naslov === CUSTOM_EVENT_TITLE ? customNaslov.trim() : naslov.trim();

  function resetEventForm() {
    const today = todayKey();
    setNaslov("");
    setCustomNaslov("");
    setOpomba("");
    setDatum(today);
    setReminderDate(today);
  }

  function openEventModal() {
    resetEventForm();
    setModalOpen(true);
  }

  function closeEventModal() {
    resetEventForm();
    setModalOpen(false);
  }

  async function addOpravilo() {
    const title = resolvedTitle;
    if (!title || !z || savingEvent) return;
    if (!token) {
      Alert.alert("Seja je potekla", "Prijavi se znova.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
      Alert.alert("Datum", "Izberi datum opravila.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(reminderDate)) {
      Alert.alert("Opomnik", "Izberi datum opomnika.");
      return;
    }
    if (reminderDate > datum) {
      Alert.alert("Opomnik", "Datum opomnika mora biti na dan opravila ali prej.");
      return;
    }
    setSavingEvent(true);
    try {
      await createOpravilo(token, {
        naslov: title,
        opomba: opomba.trim() || undefined,
        datum,
        reminderDate,
        notificationId: null,
        zivalId: z.id,
      });
      closeEventModal();
    } catch (err) {
      Alert.alert("Napaka", err instanceof Error ? err.message : "Opravila ni bilo mogoče shraniti.");
    } finally {
      setSavingEvent(false);
    }
  }

  function onEventDateChange(next: string) {
    setReminderDate((rem) => (rem === datum || !rem ? next : rem));
    setDatum(next);
  }

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
          <View style={[styles.avatar, male && styles.avatarBull]}>
            <Tag size={22} color={C.green} />
          </View>
          <View style={styles.nameCol}>
            <Text style={styles.name}>{z.ime}</Text>
            <EarTag size={11}>{z.si_id}</EarTag>
          </View>
          {female ? (
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
          ) : null}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          <PillTabs
            tabs={[
              { key: "pregled", label: "Pregled" },
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
              <Row label="Spol" value={sexLabel ?? "—"} />
              <Row label="Pasma" value={z.pasma} />
              <Row label="Datum rojstva" value={z.datum_rojstva} />
              <Row
                label="Mati"
                value={
                  z.motherId != null
                    ? animals.find((a) => a.id === z.motherId)?.ime ?? `#${z.motherId}`
                    : "—"
                }
              />
              <Row
                label="Oče"
                value={
                  z.fatherId != null
                    ? animals.find((a) => a.id === z.fatherId)?.ime ?? `#${z.fatherId}`
                    : "—"
                }
              />
              {/*<Row label="Laktacija" value={`#${z.laktacija}`} />*/}
            </Card>
            <View style={styles.sectionHeader}>
              <SectionLabel>Opravila</SectionLabel>
              <Pressable
                onPress={openEventModal}
                hitSlop={8}
                style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
                accessibilityLabel="Dodaj opravilo"
              >
                <Plus size={16} color={C.paper} />
              </Pressable>
            </View>
            {animalTasks.length === 0 ? (
              <Empty text="Ni opravil za to žival." />
            ) : (
              animalTasks.map((o) => {
                const past = o.datum < dayKey;
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

      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={closeEventModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Novo opravilo</Text>
            <Text style={styles.modalAnimal}>
              {z.ime} · {z.si_id}
            </Text>
            <View style={styles.field}>
              <SelectField
                label="Vrsta opravila"
                value={naslov}
                options={EVENT_TITLE_OPTIONS}
                onChange={(value) => {
                  setNaslov(value);
                  if (value !== CUSTOM_EVENT_TITLE) setCustomNaslov("");
                }}
                placeholder="Izberi opravilo"
              />
            </View>
            {naslov === CUSTOM_EVENT_TITLE && (
              <View style={styles.field}>
                <TextField
                  label="Druga vrsta"
                  value={customNaslov}
                  onChangeText={setCustomNaslov}
                  placeholder="Vnesi vrsto opravila"
                  autoCapitalize="sentences"
                />
              </View>
            )}
            <View style={styles.field}>
              <DateField label="Datum" value={datum} onChange={onEventDateChange} allowFuture />
            </View>
            <View style={styles.field}>
              <DateField label="Datum opomnika" value={reminderDate} onChange={setReminderDate} allowFuture />
            </View>
            <TextInput
              value={opomba}
              onChangeText={setOpomba}
              placeholder="Opomba (neobvezno)"
              placeholderTextColor={C.faint}
              style={[styles.input, styles.inputMultiline]}
              multiline
            />
            <Text style={styles.modalHint}>Opomnik boš prejel ob 8.00 na izbrani dan.</Text>
            <View style={styles.modalActions}>
              <Pressable
                onPress={closeEventModal}
                style={({ pressed }) => [styles.modalButton, styles.modalCancel, pressed && styles.deletePressed]}
              >
                <Text style={styles.modalCancelText}>Prekliči</Text>
              </Pressable>
              <Pressable
                onPress={addOpravilo}
                disabled={!resolvedTitle || savingEvent}
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.modalSave,
                  (!resolvedTitle || savingEvent) && styles.modalSaveDisabled,
                  pressed && styles.deletePressed,
                ]}
              >
                {savingEvent ? (
                  <ActivityIndicator size="small" color={C.paper} />
                ) : (
                  <Text style={styles.modalSaveText}>Shrani</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  avatarBull: {
    backgroundColor: "#E8F1F7",
  },
  nameCol: {
    gap: 2,
    flexShrink: 1,
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.green,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  addButtonPressed: {
    opacity: 0.85,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(35, 48, 31, 0.45)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.line,
    padding: 18,
  },
  modalTitle: {
    fontFamily: F.display,
    fontSize: 18,
    color: C.ink,
  },
  modalAnimal: {
    color: C.soil,
    fontSize: 12,
    fontFamily: F.sansMedium,
    marginTop: 2,
    marginBottom: 12,
  },
  field: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 10,
    backgroundColor: C.bg,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13.5,
    fontFamily: F.sans,
    color: C.ink,
    marginBottom: 8,
  },
  inputMultiline: {
    minHeight: 64,
    textAlignVertical: "top",
  },
  modalHint: {
    color: C.faint,
    fontSize: 11.5,
    fontFamily: F.sans,
    marginBottom: 14,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  modalButton: {
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
    minWidth: 88,
    alignItems: "center",
  },
  modalCancel: {
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.card,
  },
  modalCancelText: {
    color: C.ink,
    fontSize: 12.5,
    fontFamily: F.sansMedium,
  },
  modalSave: {
    backgroundColor: C.green,
  },
  modalSaveDisabled: {
    opacity: 0.4,
  },
  modalSaveText: {
    color: C.paper,
    fontSize: 12.5,
    fontFamily: F.sansMedium,
  },
});
