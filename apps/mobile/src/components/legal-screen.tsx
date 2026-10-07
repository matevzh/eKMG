import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TopBar } from "@/components/ui";
import { C, F } from "@/constants/theme";
import type { LegalDocument } from "@/constants/legal";

// Renders a bundled legal document (Pogoji uporabe / Politika zasebnosti) as a
// scrollable, read-only screen. The text ships with the app so it is available
// offline and at registration time before the user has an account.
export function LegalScreen({ doc }: { doc: LegalDocument }) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <TopBar title={doc.title} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.updated}>Zadnja posodobitev: {doc.updated}</Text>

        {doc.intro.map((p, i) => (
          <Text key={`intro-${i}`} style={styles.paragraph}>
            {p}
          </Text>
        ))}

        {doc.sections.map((section) => (
          <View key={section.heading} style={styles.section}>
            <Text style={styles.heading}>{section.heading}</Text>
            {section.body.map((p, i) => (
              <Text key={`${section.heading}-${i}`} style={styles.paragraph}>
                {p}
              </Text>
            ))}
          </View>
        ))}

        <Text style={styles.version}>Različica besedila: {doc.version}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 12,
  },
  updated: {
    fontFamily: F.sans,
    fontSize: 12,
    color: C.faint,
  },
  section: {
    gap: 8,
    marginTop: 8,
  },
  heading: {
    fontFamily: F.sansSemiBold,
    fontSize: 16,
    color: C.ink,
  },
  paragraph: {
    fontFamily: F.sans,
    fontSize: 14,
    lineHeight: 21,
    color: C.muted,
  },
  version: {
    fontFamily: F.mono,
    fontSize: 11,
    color: C.faint,
    marginTop: 20,
  },
});
