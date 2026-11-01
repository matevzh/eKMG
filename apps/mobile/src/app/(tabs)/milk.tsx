import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/screen";
import { Empty, PillTabs } from "@/components/ui";

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
        {tab === "molzenja" ? (
          <Empty text="Ni zabeleženih molž." />
        ) : (
          <Empty text="Ni zabeleženih dostav." />
        )}
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
});
