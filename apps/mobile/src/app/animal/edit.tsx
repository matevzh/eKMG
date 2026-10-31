import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { KeyboardForm } from "@/components/keyboard-form";
import { DateField, Empty, PillTabs, PrimaryButton, SelectField, TextField, TopBar } from "@/components/ui";
import { BREEDS, GENDERS, isFemaleAnimal } from "@/constants/data";
import { C, F } from "@/constants/theme";
import { updateAnimal, useAnimals } from "@/lib/animals-store";
import { useAuth } from "@/lib/auth-context";
import { getAnimalById } from "@/lib/db/animals";

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

function siSuffixFromTag(si_id: string): string {
  return si_id.replace(/^SI\s*/i, "").replace(/\D/g, "");
}

export default function EditAnimalScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const herd = useAnimals();
  const animalId = Number(id);
  const row = Number.isFinite(animalId) ? getAnimalById(animalId) : null;

  const [ime, setIme] = useState(row?.name ?? "");
  const [siSuffix, setSiSuffix] = useState(row ? siSuffixFromTag(row.si_id) : "");
  const [breed, setBreed] = useState(row?.breed ?? "");
  const [spol, setSpol] = useState<string>(row?.gender ?? GENDERS[0].value);
  const [datumRojstva, setDatumRojstva] = useState(row?.date_of_birth ?? "");
  const [datumPridobitve, setDatumPridobitve] = useState(row?.acquisition_date ?? "");
  const [laktacija] = useState(String(row?.lactation ?? 0));
  const [isLactating, setIsLactating] = useState(!!row?.is_lactating);
  const [isPregnant, setIsPregnant] = useState(!!row?.is_pregnant);
  const [motherId, setMotherId] = useState(row?.mother_id != null ? String(row.mother_id) : NONE);
  const [fatherId, setFatherId] = useState(row?.father_id != null ? String(row.father_id) : NONE);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const female = isFemaleAnimal(spol);

  const motherOptions = useMemo(
    () => [
      { value: NONE, label: "Brez" },
      ...herd
        .filter((a) => a.id !== animalId && a.gender !== "Moški")
        .map((a) => ({ value: String(a.id), label: parentLabel(a.ime, a.si_id) })),
    ],
    [herd, animalId],
  );
  const fatherOptions = useMemo(
    () => [
      { value: NONE, label: "Brez" },
      ...herd
        .filter((a) => a.id !== animalId && a.gender !== "Ženska")
        .map((a) => ({ value: String(a.id), label: parentLabel(a.ime, a.si_id) })),
    ],
    [herd, animalId],
  );

  const canSubmit = ime.trim().length > 0 && siSuffix.trim().length > 0;

  async function onSubmit() {
    if (!canSubmit || submitting || !row) return;
    if (!token) {
      setError("Seja je potekla. Prijavi se znova.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await updateAnimal(token, row.id, {
        ime: ime.trim(),
        si_id: `SI ${siSuffix.trim()}`,
        breed,
        spol,
        isLactating: female ? isLactating : false,
        isPregnant: female ? isPregnant : false,
        datum_rojstva: datumRojstva.trim(),
        datum_pridobitve: datumPridobitve.trim(),
        laktacija: Number.parseInt(laktacija, 10) || 0,
        motherId: motherId ? Number(motherId) : null,
        fatherId: fatherId ? Number(fatherId) : null,
      });
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Živali ni bilo mogoče shraniti.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!row) {
    return (
      <SafeAreaView edges={["top"]} style={styles.root}>
        <TopBar title="Uredi žival" onBack={() => router.back()} />
        <View style={styles.missing}>
          <Empty text="Žival ni bila najdena." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.root}>
      <TopBar title="Uredi žival" onBack={() => router.back()} />
      <KeyboardForm>
        <View style={styles.form}>
          <TextField label="Ime" value={ime} onChangeText={setIme} placeholder="Lenka" autoCapitalize="words" />
          <TextField
            label="Ušesna znamka"
            value={siSuffix}
            onChangeText={(text) => setSiSuffix(text.replace(/\D/g, ""))}
            placeholder="44710231"
            keyboardType="number-pad"
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
          {female ? (
            <>
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
            </>
          ) : null}
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
          <PrimaryButton label="Shrani" onPress={onSubmit} disabled={!canSubmit} loading={submitting} />
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
  missing: {
    paddingHorizontal: 16,
    paddingTop: 24,
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
