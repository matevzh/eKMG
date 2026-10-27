import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { KeyboardForm } from "@/components/keyboard-form";
import { DateField, PillTabs, PrimaryButton, SelectField, TextField, TopBar } from "@/components/ui";
import { BREEDS, GENDERS } from "@/constants/data";
import { C, F } from "@/constants/theme";
import { addAnimal, useAnimals } from "@/lib/animals-store";
import { useAuth } from "@/lib/auth-context";

const GENDER_TABS = GENDERS.map((g) => ({ key: g.value, label: g.label }));
const BREED_OPTIONS = BREEDS.map((b) => ({ value: b.code, label: b.label }));
const YES_NO_TABS = [
  { key: "true", label: "Da" },
  { key: "false", label: "Ne" },
];
const NONE = "";

function parentLabel(ime: string, si_id: string) {
  return `${ime} · ${si_id}`;
}

export default function NewAnimalScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const herd = useAnimals();
  const [ime, setIme] = useState("");
  // Ear tag is always prefixed with the SI country code; the user edits only the rest.
  const [siSuffix, setSiSuffix] = useState("");
  const [breed, setBreed] = useState("");
  const [spol, setSpol] = useState<string>(GENDERS[0].value);
  const [datumRojstva, setDatumRojstva] = useState("");
  const [datumPridobitve, setDatumPridobitve] = useState("");
  const [datumOznacitve, setDatumOznacitve] = useState("");
  const [laktacija, setLaktacija] = useState("");
  const [isLactating, setIsLactating] = useState(false);
  const [isPregnant, setIsPregnant] = useState(false);
  const [motherId, setMotherId] = useState(NONE);
  const [fatherId, setFatherId] = useState(NONE);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const motherOptions = useMemo(
    () => [
      { value: NONE, label: "Brez" },
      ...herd
        .filter((a) => a.gender !== "Moški")
        .map((a) => ({ value: String(a.id), label: parentLabel(a.ime, a.si_id) })),
    ],
    [herd],
  );
  const fatherOptions = useMemo(
    () => [
      { value: NONE, label: "Brez" },
      ...herd
        .filter((a) => a.gender !== "Ženska")
        .map((a) => ({ value: String(a.id), label: parentLabel(a.ime, a.si_id) })),
    ],
    [herd],
  );

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
        isLactating,
        isPregnant,
        datum_rojstva: datumRojstva.trim(),
        datum_pridobitve: datumPridobitve.trim(),
        datum_oznacitve: datumOznacitve.trim(),
        laktacija: Number.parseInt(laktacija, 10) || 0,
        motherId: motherId ? Number(motherId) : null,
        fatherId: fatherId ? Number(fatherId) : null,
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
      <KeyboardForm>
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
          {/*<TextField
            label="Zaporedna laktacija"
            value={laktacija}
            onChangeText={setLaktacija}
            placeholder="0"
            keyboardType="number-pad"
          />*/}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Trenutno molzna</Text>
            <PillTabs
              tabs={YES_NO_TABS}
              active={String(isLactating)}
              onChange={(value) => setIsLactating(value === "true")}
            />
          </View>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Breja</Text>
            <PillTabs
              tabs={YES_NO_TABS}
              active={String(isPregnant)}
              onChange={(value) => setIsPregnant(value === "true")}
            />
          </View>
          <SelectField
            label="Mati (neobvezno)"
            value={motherId}
            options={motherOptions}
            onChange={setMotherId}
            placeholder="Izberi mater…"
          />
          <SelectField
            label="Oče (neobvezno)"
            value={fatherId}
            options={fatherOptions}
            onChange={setFatherId}
            placeholder="Izberi očeta…"
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <PrimaryButton label="Dodaj žival" onPress={onSubmit} disabled={!canSubmit} loading={submitting} />
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
