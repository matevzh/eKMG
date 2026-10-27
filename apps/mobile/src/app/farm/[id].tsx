import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { KeyboardForm } from "@/components/keyboard-form";
import { PrimaryButton, TextField, TopBar } from "@/components/ui";
import { C, F } from "@/constants/theme";
import * as api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function EditFarmScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { token } = useAuth();
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [province, setProvince] = useState("");
    const [postOffice, setPostOffice] = useState("");
    const [loading, setLoading] = useState(Boolean(token));
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        let active = true;
        api
            .getProfile(token)
            .then((profile) => {
                if (!active) return;
                if (String(profile.farm.id) !== id) {
                    setError("Podatki o kmetiji niso na voljo.");
                    return;
                }
                setName(profile.farm.name ?? "");
                setLocation(profile.farm.location ?? "");
                setProvince(profile.farm.province ?? "");
                setPostOffice(profile.farm.postOffice ?? "");
            })
            .catch((err: unknown) => {
                if (active) {
                    setError(err instanceof Error ? err.message : "Podatkov o kmetiji ni bilo mogoče naložiti.");
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [id, token]);

    async function onSubmit() {
        if (!token || submitting) return;
        setError(null);
        setSubmitting(true);
        try {
            await api.updateFarm(token, {
                name: name.trim(),
                location: location.trim(),
                province: province.trim(),
                postOffice: postOffice.trim(),
            });
            router.back();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Shranjevanje ni uspelo.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <SafeAreaView edges={["top"]} style={styles.root}>
            <TopBar title="Uredi kmetijo" onBack={() => router.back()} />
            <KeyboardForm contentStyle={styles.content}>
                {!token ? (
                    <Text style={styles.error}>Seja je potekla. Prijavi se znova.</Text>
                ) : loading ? (
                    <ActivityIndicator color={C.green} />
                ) : (
                    <View style={styles.form}>
                        <TextField
                            label="Ime kmetije"
                            value={name}
                            onChangeText={setName}
                            placeholder="Kmetija Novak"
                            autoCapitalize="words"
                        />
                        <TextField
                            label="Lokacija"
                            value={location}
                            onChangeText={setLocation}
                            placeholder="Trbovlje"
                            autoCapitalize="words"
                        />
                        <TextField
                            label="Občina"
                            value={province}
                            onChangeText={setProvince}
                            placeholder="Trbovlje"
                            autoCapitalize="words"
                        />
                        <TextField
                            label="Pošta"
                            value={postOffice}
                            onChangeText={setPostOffice}
                            placeholder="1420 Trbovlje"
                            autoCapitalize="words"
                        />
                        {error && <Text style={styles.error}>{error}</Text>}
                        <PrimaryButton
                            label="Shrani spremembe"
                            onPress={onSubmit}
                            loading={submitting}
                            disabled={!token || !name.trim() || !location.trim() || loading}
                        />
                    </View>
                )}
                {error && loading && <Text style={styles.error}>{error}</Text>}
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
        paddingTop: 16,
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
