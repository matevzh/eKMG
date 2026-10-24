
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton, TextField, TopBar } from "@/components/ui";
import { C, F } from "@/constants/theme";
import * as api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function EditProfileScreen() {
    const router = useRouter();
    const { token } = useAuth();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
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
                setFirstName(profile.firstName ?? "");
                setLastName(profile.lastName ?? "");
                setEmail(profile.email ?? "");
            })
            .catch((err: unknown) => {
                if (active) {
                    setError(err instanceof Error ? err.message : "Podatkov o profilu ni bilo mogoče naložiti.");
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [token]);

    async function onSubmit() {
        if (!token || submitting) return;

        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();

        if (!trimmedFirstName || !trimmedLastName || !trimmedEmail) {
            setError("Vnesi ime, priimek in e-poštni naslov.");
            return;
        }

        setError(null);
        setSubmitting(true);

        try {
            await api.updateProfile(token, {
                firstName: trimmedFirstName,
                lastName: trimmedLastName,
                email: trimmedEmail,
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
            <TopBar title="Uredi profil" onBack={() => router.back()} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.flex}
            >
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    {!token ? (
                        <Text style={styles.error}>Seja je potekla. Prijavi se znova.</Text>
                    ) : loading ? (
                        <ActivityIndicator color={C.green} />
                    ) : (
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
                                placeholder="janez@example.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            {error && <Text style={styles.error}>{error}</Text>}

                            <PrimaryButton
                                label="Shrani spremembe"
                                onPress={onSubmit}
                                loading={submitting}
                                disabled={!token || loading}
                            />
                        </View>
                    )}
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
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
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