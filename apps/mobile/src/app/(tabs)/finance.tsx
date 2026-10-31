import { TrendingDown, TrendingUp } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/screen";
import { Card, SectionLabel } from "@/components/ui";
import { ODHODKI, PRIHODKI } from "@/constants/data";
import { C, F } from "@/constants/theme";
import { formatEuDate } from "@/lib/dates";

export default function FinanceScreen() {
  const totalIn = PRIHODKI.reduce((a, b) => a + b.kolicina, 0);
  const totalOut = ODHODKI.reduce((a, b) => a + b.kolicina, 0);

  return (
    <Screen title="Finance">
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <TrendingUp size={14} color={C.green} />
            <Text style={[styles.statLabel, { color: C.green }]}>PRIHODKI</Text>
          </View>
          <Text style={styles.statValue}>{totalIn.toFixed(2)} €</Text>
        </Card>
        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <TrendingDown size={14} color={C.red} />
            <Text style={[styles.statLabel, { color: C.red }]}>ODHODKI</Text>
          </View>
          <Text style={styles.statValue}>{totalOut.toFixed(2)} €</Text>
        </Card>
      </View>

      <SectionLabel>Prihodki</SectionLabel>
      <View style={styles.list}>
        {PRIHODKI.map((p) => (
          <Card key={p.id}>
            <View style={styles.itemRow}>
              <View>
                <Text style={styles.itemTitle}>{p.kategorija}</Text>
                <Text style={styles.itemMeta}>{formatEuDate(p.datum)}</Text>
              </View>
              <Text style={[styles.itemAmount, { color: C.green }]}>+{p.kolicina.toFixed(2)} €</Text>
            </View>
          </Card>
        ))}
      </View>

      <SectionLabel>Odhodki</SectionLabel>
      <View style={styles.list}>
        {ODHODKI.map((o) => (
          <Card key={o.id}>
            <View style={styles.itemRow}>
              <View>
                <Text style={styles.itemTitle}>{o.kategorija}</Text>
                <Text style={styles.itemMeta}>
                  {formatEuDate(o.datum)} · {o.prodajalec}
                </Text>
              </View>
              <Text style={[styles.itemAmount, { color: C.red }]}>−{o.kolicina.toFixed(2)} €</Text>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
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
    fontSize: 11,
    fontFamily: F.sansSemiBold,
  },
  statValue: {
    fontFamily: F.display,
    fontSize: 20,
    color: C.ink,
  },
  list: {
    gap: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemTitle: {
    color: C.ink,
    fontSize: 13,
    fontFamily: F.sansMedium,
  },
  itemMeta: {
    color: C.faint,
    fontSize: 11,
    fontFamily: F.sans,
    marginTop: 1,
  },
  itemAmount: {
    fontFamily: F.monoSemiBold,
    fontSize: 13,
  },
});
