import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DateField, PillTabs, PrimaryButton, SelectField, TextField, TopBar } from "@/components/ui";
import { BREEDS, GENDERS, STATUS_STYLE, type AnimalStatus } from "@/constants/data";
import { C, F } from "@/constants/theme";
import { addAnimal } from "@/lib/animals-store";
import { useAuth } from "@/lib/auth-context";

const STATUS_TABS = (Object.keys(STATUS_STYLE) as AnimalStatus[]).map((key) => ({
  key,
  label: STATUS_STYLE[key].label,
}));

const GENDER_TABS = GENDERS.map((g) => ({ key: g.value, label: g.label }));
const BREED_OPTIONS = BREEDS.map((b) => ({ value: b.code, label: b.label }));

export default function NewAnimalScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [ime, setIme] = useState("");
  // Ear tag is always prefixed with the SI country code; the user edits only the rest.
  const [siSuffix, setSiSuffix] = useState("");
  const [breed, setBreed] = useState("");
  const [spol, setSpol] = useState<string>(GENDERS[0].value);
  const [datumRojstva, setDatumRojstva] = useState("");
  const [datumPridobitve, setDatumPridobitve] = useState("");
  const [datumOznacitve, setDatumOznacitve] = useState("");
  const [laktacija, setLaktacija] = useState("");
  const [status, setStatus] = useState<AnimalStatus>("aktivna");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = ime.trim().length > 0 && siSuffix.trim().length > 0;

  async function onSubmit() {
    if (!canSubmit || submitting) return;
    if (!token) {
      setError("Seja je potekla. Prijavi se znova.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await addAnimal(token, {
        ime: ime.trim(),
        si_id: `SI ${siSuffix.trim()}`,
        breed,
        spol,
        status,
        datum_rojstva: datumRojstva.trim(),
        datum_pridobitve: datumPridobitve.trim(),
        datum_oznacitve: datumOznacitve.trim(),
        laktacija: Number.parseInt(laktacija, 10) || 0,
      });
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Žival ni bilo mogoče dodati.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.root}>
      <TopBar title="Nova žival" onBack={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <TextField label="Ime" value={ime} onChangeText={setIme} placeholder="Lenka" autoCapitalize="words" />
            <TextField
              label="Ušesna znamka"
              value={siSuffix}
              onChangeText={setSiSuffix}
              placeholder="4471 0231"
              autoCapitalize="characters"
              keyboardType="numbers-and-punctuation"
              prefix="SI"
            />
            <SelectField
              label="Pasma"
              value={breed}
              options={BREED_OPTIONS}
              onChange={setBreed}
              placeholder="Izberi pasmo…"
            />
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Spol</Text>
              <PillTabs tabs={GENDER_TABS} active={spol} onChange={setSpol} />
            </View>
            <DateField label="Datum rojstva" value={datumRojstva} onChange={setDatumRojstva} />
            <DateField label="Datum pridobitve" value={datumPridobitve} onChange={setDatumPridobitve} />
            <DateField label="Datum označitve" value={datumOznacitve} onChange={setDatumOznacitve} />
            <TextField
              label="Laktacija"
              value={laktacija}
              onChangeText={setLaktacija}
              placeholder="0"
              keyboardType="number-pad"
            />
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Status</Text>
              <PillTabs tabs={STATUS_TABS} active={status} onChange={setStatus} />
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
            <PrimaryButton label="Dodaj žival" onPress={onSubmit} disabled={!canSubmit} loading={submitting} />
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
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
  error: {
    color: C.red,
    fontSize: 13,
    fontFamily: F.sans,
  },
});
