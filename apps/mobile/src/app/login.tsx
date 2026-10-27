import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { KeyboardForm } from "@/components/keyboard-form";
import { PrimaryButton, TextField } from "@/components/ui";
import { C, F } from "@/constants/theme";
import { useAuth } from "@/lib/auth-context";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await signIn({ email: email.trim(), password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prijava ni uspela.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardForm contentStyle={styles.content}>
        <Text style={styles.title}>E-KmG</Text>
        <Text style={styles.subtitle}>Prijavi se v svoj račun</Text>

        <View style={styles.form}>
          <TextField
            label="E-pošta"
            value={email}
            onChangeText={setEmail}
            placeholder="ime@primer.si"
            keyboardType="email-address"
          />
          <TextField label="Geslo" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
          {error && <Text style={styles.error}>{error}</Text>}
          <PrimaryButton
            label="Prijavi se"
            onPress={onSubmit}
            loading={submitting}
            disabled={!email.trim() || !password}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Še nimaš računa?</Text>
          <Link href="/register" style={styles.footerLink}>
            Registriraj se
          </Link>
        </View>
      </KeyboardForm>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
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
