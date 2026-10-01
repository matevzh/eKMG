import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PillTabs, PrimaryButton, TextField } from "@/components/ui";
import { C, F } from "@/constants/theme";
import { useAuth } from "@/lib/auth-context";

const ROLE_TABS: { key: "Lastnik" | "Član"; label: string }[] = [
  { key: "Lastnik", label: "Lastnik" },
  { key: "Član", label: "Član" },
];

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Lastnik" | "Član">("Lastnik");
  const [kmgMid, setKmgMid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        role,
        password,
        kmg_mid: kmgMid.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registracija ni uspela.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Ustvari račun</Text>
          <Text style={styles.subtitle}>Vnesi KMG-MID, da te povežemo s pravo kmetijo</Text>

          <View style={styles.form}>
            <TextField label="Ime in priimek" value={name} onChangeText={setName} placeholder="Janez Novak" autoCapitalize="words" />
            <TextField
              label="E-pošta"
              value={email}
              onChangeText={setEmail}
              placeholder="ime@primer.si"
              keyboardType="email-address"
            />
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Vloga</Text>
              <PillTabs tabs={ROLE_TABS} active={role} onChange={setRole} />
            </View>
            <TextField
              label="KMG-MID"
              value={kmgMid}
              onChangeText={setKmgMid}
              placeholder="100482-031"
              autoCapitalize="characters"
            />
            <Text style={styles.hint}>
              Če KMG-MID že obstaja, se pridružiš tisti kmetiji. Če je nov, ustvarimo novo kmetijo.
            </Text>
            <TextField
              label="Geslo"
              value={password}
              onChangeText={setPassword}
              placeholder="Najmanj 8 znakov"
              secureTextEntry
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <PrimaryButton
              label="Registriraj se"
              onPress={onSubmit}
              loading={submitting}
              disabled={!name.trim() || !email.trim() || !kmgMid.trim() || !password}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Že imaš račun?</Text>
            <Link href="/login" style={styles.footerLink}>
              Prijavi se
            </Link>
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
  fieldWrap: {
    gap: 6,
  },
  fieldLabel: {
    color: C.soil,
    fontSize: 12,
    fontFamily: F.sansMedium,
  },
  hint: {
    color: C.faint,
    fontSize: 12,
    fontFamily: F.sans,
    marginTop: -6,
  },
  error: {
    color: C.red,
    fontSize: 13,
    fontFamily: F.sans,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  footerText: {
    color: C.faint,
    fontSize: 13,
    fontFamily: F.sans,
  },
  footerLink: {
    color: C.green,
    fontSize: 13,
    fontFamily: F.sansSemiBold,
  },
});
