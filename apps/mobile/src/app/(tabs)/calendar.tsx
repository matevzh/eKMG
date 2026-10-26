import { Bell, BellOff, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Screen } from "@/components/screen";
import { SyncBanner } from "@/components/sync-banner";
import { Card, Empty, SectionLabel, SelectField, TextField } from "@/components/ui";
import { C, F } from "@/constants/theme";
import { loadAnimals, useAnimals } from "@/lib/animals-store";
import { useAuth } from "@/lib/auth-context";
import { addEventPushListener } from "@/lib/notifications";
import { syncNow } from "@/lib/sync/engine";
import { createOpravilo, deleteOpravilo, loadOpravila, useOpravila, type Opravilo } from "@/lib/tasks";

const MESECI = [
  "januar",
  "februar",
  "marec",
  "april",
  "maj",
  "junij",
  "julij",
  "avgust",
  "september",
  "oktober",
  "november",
  "december",
];
const DNEVI = ["pon", "tor", "sre", "čet", "pet", "sob", "ned"];

// Preset event titles in the add-opravilo dropdown. "Drugo" is UI-only: the
// user then types a custom title, which is what gets saved.
const EVENT_TITLES = ["Predvidena telitev", "Veterinarski pregled", "Semenitev", "Premik", "Drugo"];
const CUSTOM_TITLE = "Drugo";
const EVENT_TITLE_OPTIONS = EVENT_TITLES.map((t) => ({ value: t, label: t }));

const pad = (n: number) => String(n).padStart(2, "0");
const toKey = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;
const parseKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const fmtKey = (key: string) => {
  const d = parseKey(key);
  return `${d.getDate()}. ${MESECI[d.getMonth()]} ${d.getFullYear()}`;
};

// Weeks of a month as day numbers, Monday-first, padded with nulls.
function monthMatrix(year: number, month: number): (number | null)[][] {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export default function CalendarScreen() {
  const today = new Date();
  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());

  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState(todayKey);
  const [modalOpen, setModalOpen] = useState(false);
  const [naslov, setNaslov] = useState("");
  const [customNaslov, setCustomNaslov] = useState("");
  const [opomba, setOpomba] = useState("");
  const [zivalId, setZivalId] = useState("");

  const { token } = useAuth();
  const animals = useAnimals();
  const opravila = useOpravila();

  useEffect(() => {
    if (!token) return;
    loadOpravila(token).catch(() => {});
    loadAnimals(token).catch(() => {});
  }, [token]);

  // Refresh when another farm device pushes an event change (live sync).
  useEffect(() => {
    if (!token) return;
    return addEventPushListener(() => {
      void syncNow();
    });
  }, [token]);

  const zivalOptions = useMemo(
    () => [
      { value: "", label: "Brez živali" },
      ...animals.map((a) => ({ value: String(a.id), label: `${a.ime} · ${a.si_id}` })),
    ],
    [animals],
  );

  const weeks = useMemo(() => monthMatrix(cursor.year, cursor.month), [cursor]);
  const daysWithTasks = useMemo(() => new Set(opravila.map((o) => o.datum)), [opravila]);
  const selectedTasks = opravila.filter((o) => o.datum === selected);
  const upcoming = opravila
    .filter((o) => o.datum >= todayKey)
    .sort((a, b) => a.datum.localeCompare(b.datum));

  const shiftMonth = (delta: number) => {
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const resolvedTitle = naslov === CUSTOM_TITLE ? customNaslov.trim() : naslov.trim();

  const resetForm = () => {
    setNaslov("");
    setCustomNaslov("");
    setOpomba("");
    setZivalId("");
  };

  const addOpravilo = async () => {
    const title = resolvedTitle;
    if (!title) return;
    if (!token) {
      Alert.alert("Seja je potekla", "Prijavi se znova.");
      return;
    }

    // Reminders are sent by the server (a week before, at 08:00) to every
    // registered farm device — no local scheduling needed here.
    const zival = animals.find((a) => String(a.id) === zivalId);
    try {
      await createOpravilo(token, {
        naslov: title,
        opomba: opomba.trim() || undefined,
        datum: selected,
        notificationId: null,
        zivalId: zival?.id ?? null,
      });
      resetForm();
      setModalOpen(false);
    } catch (err) {
      Alert.alert("Napaka", err instanceof Error ? err.message : "Opravila ni bilo mogoče shraniti.");
    }
  };

  const removeOpravilo = async (opravilo: Opravilo) => {
    if (!token) return;
    try {
      await deleteOpravilo(token, opravilo.id);
    } catch (err) {
      Alert.alert("Napaka", err instanceof Error ? err.message : "Opravila ni bilo mogoče izbrisati.");
    }
  };

  // Lead times (days before the event, at 08:00) the server sends reminders at.
  // Keep in sync with REMINDER_OFFSETS in the API's reminder.service.ts.
  const REMINDER_LEADS = [7, 1];

  // The next reminder still due to fire for an event, or null if its last
  // reminder moment has already passed.
  const nextReminderMoment = (o: Opravilo): Date | null => {
    const now = Date.now();
    // Largest lead first → earliest moment first, so we surface the next to fire.
    for (const lead of [...REMINDER_LEADS].sort((a, b) => b - a)) {
      const r = parseKey(o.datum);
      r.setDate(r.getDate() - lead);
      r.setHours(8, 0, 0, 0);
      if (r.getTime() > now) return r;
    }
    return null;
  };

  // A reminder is expected if the server already sent the final one, or a
  // reminder moment is still in the future.
  const reminderActive = (o: Opravilo) => o.reminderSent || nextReminderMoment(o) != null;

  const reminderLabel = (o: Opravilo) => {
    if (o.reminderSent) return "Opomnik poslan";
    const next = nextReminderMoment(o);
    if (!next) return "Brez opomnika";
    return `Opomnik ${next.getDate()}. ${next.getMonth() + 1}. ob 8.00`;
  };

  const TaskCard = ({ o, showDate }: { o: Opravilo; showDate?: boolean }) => (
    <Card>
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleWrap}>
          {showDate && <Text style={styles.taskDate}>{fmtKey(o.datum)}</Text>}
          <Text style={styles.taskTitle}>{o.naslov}</Text>
          {!!o.zivalIme && (
            <Text style={styles.taskAnimal}>
              {o.zivalIme} · {o.zivalSiId}
            </Text>
          )}
          {!!o.opomba && <Text style={styles.taskNote}>{o.opomba}</Text>}
        </View>
        <Pressable onPress={() => removeOpravilo(o)} hitSlop={8} style={({ pressed }) => pressed && styles.pressed}>
          <Trash2 size={16} color={C.red} />
        </Pressable>
      </View>
      <View style={styles.reminderRow}>
        {reminderActive(o) ? <Bell size={12} color={C.amber} /> : <BellOff size={12} color={C.faint} />}
        <Text style={[styles.reminderText, { color: reminderActive(o) ? C.amber : C.faint }]}>{reminderLabel(o)}</Text>
      </View>
    </Card>
  );

  return (
    <Screen
      title="Koledar"
      right={
        <Pressable onPress={() => setModalOpen(true)} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
          <Plus size={18} color={C.paper} />
        </Pressable>
      }
    >
      {/* <SyncBanner /> */}
      <Card style={styles.calendarCard}>
        <View style={styles.monthHeader}>
          <Pressable onPress={() => shiftMonth(-1)} hitSlop={8} style={({ pressed }) => pressed && styles.pressed}>
            <ChevronLeft size={20} color={C.green} />
          </Pressable>
          <Text style={styles.monthTitle}>
            {MESECI[cursor.month]} {cursor.year}
          </Text>
          <Pressable onPress={() => shiftMonth(1)} hitSlop={8} style={({ pressed }) => pressed && styles.pressed}>
            <ChevronRight size={20} color={C.green} />
          </Pressable>
        </View>

        <View style={styles.weekRow}>
          {DNEVI.map((d) => (
            <Text key={d} style={styles.weekday}>
              {d}
            </Text>
          ))}
        </View>

        {weeks.map((week, wi) => (
          <View key={wi} style={styles.weekRow}>
            {week.map((day, di) => {
              if (day === null) return <View key={di} style={styles.dayCell} />;
              const key = toKey(cursor.year, cursor.month, day);
              const isSelected = key === selected;
              const isToday = key === todayKey;
              return (
                <Pressable
                  key={di}
                  onPress={() => setSelected(key)}
                  style={[styles.dayCell, isToday && styles.dayToday, isSelected && styles.daySelected]}
                >
                  <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>{day}</Text>
                  <View style={[styles.dot, daysWithTasks.has(key) && { backgroundColor: isSelected ? C.paper : C.amber }]} />
                </Pressable>
              );
            })}
          </View>
        ))}
      </Card>

      <SectionLabel>Opravila · {fmtKey(selected)}</SectionLabel>
      <View style={styles.list}>
        {selectedTasks.length === 0 && <Empty text="Za ta dan ni opravil." />}
        {selectedTasks.map((o) => (
          <TaskCard key={o.id} o={o} />
        ))}
      </View>

      <SectionLabel>Prihajajoča opravila</SectionLabel>
      <View style={styles.list}>
        {upcoming.length === 0 && <Empty text="Ni prihajajočih opravil." />}
        {upcoming.map((o) => (
          <TaskCard key={o.id} o={o} showDate />
        ))}
      </View>

      <Modal
        visible={modalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => {
          resetForm();
          setModalOpen(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Novo opravilo</Text>
            <Text style={styles.modalDate}>{fmtKey(selected)}</Text>
            <View style={styles.zivalField}>
              <SelectField
                label="Vrsta opravila"
                value={naslov}
                options={EVENT_TITLE_OPTIONS}
                onChange={(value) => {
                  setNaslov(value);
                  if (value !== CUSTOM_TITLE) setCustomNaslov("");
                }}
                placeholder="Izberi opravilo"
              />
            </View>
            {naslov === CUSTOM_TITLE && (
              <View style={styles.zivalField}>
                <TextField
                  label="Druga vrsta"
                  value={customNaslov}
                  onChangeText={setCustomNaslov}
                  placeholder="Vnesi vrsto opravila"
                  autoCapitalize="sentences"
                />
              </View>
            )}
            <View style={styles.zivalField}>
              <SelectField
                label="Žival"
                value={zivalId}
                options={zivalOptions}
                onChange={setZivalId}
                placeholder="Brez živali"
              />
            </View>
            <TextInput
              value={opomba}
              onChangeText={setOpomba}
              placeholder="Opomba (neobvezno)"
              placeholderTextColor={C.faint}
              style={[styles.input, styles.inputMultiline]}
              multiline
            />
            <Text style={styles.modalHint}>Opomnik boš prejel teden dni pred opravilom ob 8.00.</Text>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => {
                  resetForm();
                  setModalOpen(false);
                }}
                style={({ pressed }) => [styles.modalButton, styles.modalCancel, pressed && styles.pressed]}
              >
                <Text style={styles.modalCancelText}>Prekliči</Text>
              </Pressable>
              <Pressable
                onPress={addOpravilo}
                disabled={!resolvedTitle}
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.modalSave,
                  !resolvedTitle && styles.modalSaveDisabled,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.modalSaveText}>Shrani</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: C.green,
    borderRadius: 999,
    padding: 7,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.9,
  },
  calendarCard: {
    marginTop: 8,
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  monthTitle: {
    fontFamily: F.display,
    fontSize: 16,
    color: C.ink,
    textTransform: "capitalize",
  },
  weekRow: {
    flexDirection: "row",
  },
  weekday: {
    flex: 1,
    textAlign: "center",
    color: C.soil,
    fontSize: 10.5,
    fontFamily: F.sansSemiBold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    margin: 1,
  },
  dayToday: {
    borderWidth: 1,
    borderColor: C.sage,
  },
  daySelected: {
    backgroundColor: C.green,
  },
  dayText: {
    fontSize: 12.5,
    fontFamily: F.sansMedium,
    color: C.ink,
  },
  dayTextSelected: {
    color: C.paper,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
    backgroundColor: "transparent",
  },
  list: {
    gap: 8,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  taskTitleWrap: {
    flexShrink: 1,
    gap: 2,
  },
  taskDate: {
    color: C.soil,
    fontSize: 11,
    fontFamily: F.sansMedium,
  },
  taskTitle: {
    color: C.ink,
    fontSize: 13.5,
    fontFamily: F.sansSemiBold,
  },
  taskAnimal: {
    color: C.green,
    fontSize: 12,
    fontFamily: F.sansMedium,
  },
  taskNote: {
    color: C.muted,
    fontSize: 12,
    fontFamily: F.sans,
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },
  reminderText: {
    fontSize: 11,
    fontFamily: F.sansMedium,
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
  modalDate: {
    color: C.soil,
    fontSize: 12,
    fontFamily: F.sansMedium,
    marginTop: 2,
    marginBottom: 12,
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
  zivalField: {
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
