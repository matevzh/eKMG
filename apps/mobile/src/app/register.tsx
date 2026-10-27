import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { BackHandler, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { KeyboardForm } from "@/components/keyboard-form";
import { Checkbox, PrimaryButton, TextField } from "@/components/ui";
import { C, F } from "@/constants/theme";
import { POLICY_VERSION } from "@/constants/legal";
import { useAuth } from "@/lib/auth-context";

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [kmgMid, setKmgMid] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const step1FormValid = Boolean(firstName.trim() && lastName.trim() && email.trim() && password);
  const step2Valid = Boolean(kmgMid.trim()) && acceptedTerms;

  // On Android, the hardware back button should return to step 1 rather than
  // leaving the screen while the user is on step 2.
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (step === 2) {
        setStep(1);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [step]);

  function goBack() {
    setError(null);
    setStep(1);
  }

  async function goNext() {
    setError(null);
    setStep(2);
  }

  async function onSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await signUp({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        kmg_mid: kmgMid.trim(),
        acceptedTerms,
        policyVersion: POLICY_VERSION,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prišlo je do napake. Poskusi znova.");
      setStep(1);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardForm contentStyle={styles.content}>
        <Text style={styles.stepLabel}>Korak {step} od 2</Text>
        {step === 1 ? (
          <>
            <Text style={styles.title}>Ustvari račun</Text>
            <Text style={styles.subtitle}>Najprej nekaj o tebi</Text>

            <View style={styles.form}>
              <TextField
                label="Ime"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Janez"
                autoCapitalize="words"
              />
              <TextField
                label="Priimek"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Novak"
                autoCapitalize="words"
              />
              <TextField
                label="E-pošta"
                value={email}
                onChangeText={setEmail}
                placeholder="ime@primer.si"
                keyboardType="email-address"
              />
              <TextField
                label="Geslo"
                value={password}
                onChangeText={setPassword}
                placeholder="Najmanj 8 znakov"
                secureTextEntry
              />
              {error && <Text style={styles.error}>{error}</Text>}
              <PrimaryButton label="Naprej" onPress={goNext} disabled={!step1FormValid} />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Že imaš račun?</Text>
              <Link href="/login" style={styles.footerLink}>
                Prijavi se
              </Link>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Tvoja kmetija</Text>
            <Text style={styles.subtitle}>Vnesi KMG-MID, da te povežemo s pravo kmetijo</Text>

            <View style={styles.form}>
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
              <Checkbox checked={acceptedTerms} onToggle={() => setAcceptedTerms((v) => !v)}>
                <Text style={styles.consentText}>
                  Strinjam se s{" "}
                  <Text style={styles.consentLink} onPress={() => router.push("/terms")}>
                    Pogoji uporabe
                  </Text>{" "}
                  in{" "}
                  <Text style={styles.consentLink} onPress={() => router.push("/privacy")}>
                    Politiko zasebnosti
                  </Text>
                  .
                </Text>
              </Checkbox>
              {error && <Text style={styles.error}>{error}</Text>}
              <PrimaryButton
                label="Registriraj se"
                onPress={onSubmit}
                loading={submitting}
                disabled={!step2Valid}
              />
              <Pressable
                onPress={goBack}
                disabled={submitting}
                style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
              >
                <Text style={styles.backButtonText}>Nazaj</Text>
              </Pressable>
            </View>
          </>
        )}
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
  stepLabel: {
    fontFamily: F.sansSemiBold,
    fontSize: 12,
    color: C.soil,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: -12,
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
  consentText: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: F.sans,
  },
  consentLink: {
    color: C.green,
    fontFamily: F.sansSemiBold,
  },
  backButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: C.soil,
    fontSize: 15,
    fontFamily: F.sansSemiBold,
  },
  pressed: {
    opacity: 0.6,
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
