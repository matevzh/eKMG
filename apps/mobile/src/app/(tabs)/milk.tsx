import { Calendar } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/screen";
import { Card, PillTabs, Row } from "@/components/ui";
import { DOSTAVE, MOLZENJA } from "@/constants/data";
import { C, F } from "@/constants/theme";
import { formatEuDate } from "@/lib/dates";

type MilkTab = "molzenja" | "dostave";

export default function MilkScreen() {
  const [tab, setTab] = useState<MilkTab>("molzenja");

  return (
    <Screen title="Mleko">
      <View style={styles.tabs}>
        <PillTabs
          tabs={[
            { key: "molzenja", label: "Molže" },
            { key: "dostave", label: "Dostave" },
          ]}
          active={tab}
          onChange={setTab}
        />
      </View>

      <View style={styles.list}>
        {tab === "molzenja" &&
          MOLZENJA.map((m) => (
            <Card key={m.id}>
              <View style={styles.cardHeader}>
                <View style={styles.dateWrap}>
                  <Calendar size={13} color={C.soil} />
                  <Text style={styles.dateText}>
                    {formatEuDate(m.datum)} · {m.cas}
                  </Text>
                </View>
                <Text style={styles.amount}>{m.kolicina_mleka} L</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>Mb {m.mascoba}%</Text>
                <Text style={styles.metaText}>Beljakovine {m.beljakovine}%</Text>
                <Text style={styles.metaText}>SŠC {m.somatske_celice}k</Text>
              </View>
              <Text style={styles.enteredBy}>Vnesel: {m.vnesel}</Text>
            </Card>
          ))}

        {tab === "dostave" &&
          DOSTAVE.map((d) => (
            <Card key={d.id}>
              <View style={styles.cardHeader}>
                <Text style={styles.dateText}>{formatEuDate(d.datum)}</Text>
                <Text style={styles.amount}>{d.kolicina_litrov} L</Text>
              </View>
              <View style={[styles.metaRow, styles.metaRowSpaced]}>
                <Text style={styles.metaText}>Mb {d.mascoba}%</Text>
                <Text style={styles.metaText}>Beljakovine {d.beljakovine}%</Text>
              </View>
              <Row label="Cena/L" value={`${d.cena_na_liter.toFixed(2)} €`} compact />
              <Row label="Analiza št." value={d.stevilka_analize} compact />
            </Card>
          ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  list: {
    gap: 8,
    marginTop: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  dateWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    color: C.ink,
    fontSize: 12.5,
    fontFamily: F.sansMedium,
  },
  amount: {
    fontFamily: F.monoSemiBold,
    fontSize: 14,
    color: C.green,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
  },
  metaRowSpaced: {
    marginBottom: 4,
  },
  metaText: {
    color: C.muted,
    fontSize: 11.5,
    fontFamily: F.sans,
  },
  enteredBy: {
    color: C.faint,
    fontSize: 11,
    fontFamily: F.sans,
    marginTop: 4,
  },
});
