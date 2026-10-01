import type { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TopBar } from "@/components/ui";
import { C } from "@/constants/theme";

export function Screen({
  title,
  onBack,
  right,
  children,
  scroll = true,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
}) {
  return (
    <SafeAreaView edges={["top"]} style={styles.root}>
      <TopBar title={title} onBack={onBack} right={right} />
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
