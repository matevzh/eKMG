import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/screen";
import { Empty, SectionLabel } from "@/components/ui";

export default function FinanceScreen() {
  return (
    <Screen title="Finance">
      <SectionLabel>Prihodki</SectionLabel>
      <View style={styles.list}>
        <Empty text="Ni zabeleženih prihodkov." />
      </View>

      <SectionLabel>Odhodki</SectionLabel>
      <View style={styles.list}>
        <Empty text="Ni zabeleženih odhodkov." />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
});
