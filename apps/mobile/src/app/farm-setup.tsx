import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton, TextField } from "@/components/ui";
import { C, F } from "@/constants/theme";
import * as api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function FarmSetupScreen() {
  const router = useRouter();
  const { token, completeFarmSetup } = useAuth();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [province, setProvince] = useState("");
  const [postOffice, setPostOffice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    if (!token) return;
    setError(null);
    setSubmitting(true);
    try {
      await api.updateFarm(token, {
        name: name.trim(),
        location: location.trim(),
        province: province.trim(),
        postOffice: postOffice.trim(),
      });
      completeFarmSetup();
      router.replace("/(tabs)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Shranjevanje ni uspelo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Podatki o kmetiji</Text>
          <Text style={styles.subtitle}>Vnesi osnovne podatke o svoji kmetiji</Text>

          <View style={styles.form}>
            <TextField label="Ime kmetije" value={name} onChangeText={setName} placeholder="Kmetija Novak" autoCapitalize="words" />
            <TextField label="Lokacija" value={location} onChangeText={setLocation} placeholder="Trbovlje" autoCapitalize="words" />
            <TextField label="Občina" value={province} onChangeText={setProvince} placeholder="Trbovlje" autoCapitalize="words" />
            <TextField label="Pošta" value={postOffice} onChangeText={setPostOffice} placeholder="1420 " autoCapitalize="words" />
            {error && <Text style={styles.error}>{error}</Text>}
            <PrimaryButton
              label="Shrani kmetijo"
              onPress={onSubmit}
              loading={submitting}
              disabled={!name.trim() || !location.trim()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 24,
  },
  title: {
    fontFamily: F.display,
    fontSize: 28,
    color: C.ink,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: F.sans,
    fontSize: 14,
    color: C.faint,
    textAlign: "center",
    marginTop: -16,
  },
  form: {
    gap: 14,
  },
  error: {
    color: C.red,
    fontSize: 13,
    fontFamily: F.sans,
  },
});
