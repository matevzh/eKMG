import { StyleSheet, Text, View } from "react-native";

import { C, F } from "@/constants/theme";
import { useSyncStatus } from "@/lib/sync/status";

function formatLastSync(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}. ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Compact online/offline/sync status strip for herd + calendar screens. */
export function SyncBanner() {
  const { online, syncing, lastSyncAt, error, pendingCount } = useSyncStatus();

  let text: string;
  let tone: "amber" | "soil" | "red" | "faint" = "faint";

  if (!online) {
    text =
      pendingCount > 0
        ? `Brez povezave · ${pendingCount} čaka na sinhronizacijo`
        : "Brez povezave";
    tone = "amber";
  } else if (syncing) {
    text = "Sinhronizacija…";
    tone = "soil";
  } else if (error) {
    text = `Napaka sinhronizacije: ${error}`;
    tone = "red";
  } else if (pendingCount > 0) {
    text = `${pendingCount} sprememb čaka na pošiljanje`;
    tone = "amber";
  } else {
    const when = formatLastSync(lastSyncAt);
    text = when ? `Sinhronizirano ${when}` : "Pripravljeno";
    tone = "faint";
  }

  const color = tone === "amber" ? C.amber : tone === "red" ? C.red : tone === "soil" ? C.soil : C.faint;
  const bg = tone === "amber" || tone === "red" ? styles.amber : styles.muted;

  return (
    <View style={[styles.banner, bg]}>
      <Text style={[styles.text, { color }]} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  muted: {
    backgroundColor: C.card,
    borderColor: C.line,
  },
  amber: {
    backgroundColor: C.mist,
    borderColor: C.line,
  },
  text: {
    fontSize: 11.5,
    fontFamily: F.sansMedium,
  },
});
