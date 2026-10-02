import { User } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Share, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/screen";
import { Card, PrimaryButton, Row, SectionLabel } from "@/components/ui";
import { C, F } from "@/constants/theme";
import * as api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const DASH = "—";

export default function ProfileScreen() {
  const { user, token, signOut } = useAuth();
  const [profile, setProfile] = useState<api.Profile | null>(null);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token) return;
    let active = true;
    api
      .getProfile(token)
      .then((p) => {
        if (active) setProfile(p);
      })
      .catch(() => {
        // Fall back to the cached auth user if the request fails.
      });
    return () => {
      active = false;
    };
  }, [token]);

  async function handleExport() {
    if (!token || exporting) return;
    setExporting(true);
    try {
      const data = await api.exportMyData(token);
      await Share.share({
        title: "Izvoz mojih podatkov",
        message: JSON.stringify(data, null, 2),
      });
    } catch {
      Alert.alert("Napaka", "Izvoz podatkov ni uspel. Poskusi znova.");
    } finally {
      setExporting(false);
    }
  }

  function confirmDelete() {
    if (!token || deleting) return;
    Alert.alert(
      "Izbris računa",
      "Tvoj račun in osebni podatki bodo trajno izbrisani. Tega dejanja ni mogoče razveljaviti.",
      [
        { text: "Prekliči", style: "cancel" },
        {
          text: "Izbriši",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await api.deleteMyAccount(token);
              await signOut();
            } catch {
              setDeleting(false);
              Alert.alert("Napaka", "Izbris računa ni uspel. Poskusi znova.");
            }
          },
        },
      ],
    );
  }

  const name = profile?.name ?? user?.name ?? DASH;
  const role = profile?.role ?? user?.role ?? DASH;
  const email = profile?.email ?? user?.email ?? DASH;
  const farm = profile?.farm;
  const kmgMid = farm?.kmg_mid ?? user?.farm?.kmg_mid ?? DASH;

  return (
    <Screen title="Profil">
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User size={22} color={C.paper} />
        </View>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{role}</Text>
          <Text style={styles.role}>{email}</Text>
        </View>
      </View>

      <SectionLabel>Kmetija</SectionLabel>
      <Card>
        <Row label="Ime" value={farm?.name || DASH} compact />
        <Row label="Lastnik" value={name} compact />
        <Row label="KMG-MID" value={kmgMid} compact />
        <Row label="Lokacija" value={farm?.location || DASH} compact />
        <Row label="Občina" value={farm?.province || DASH} compact />
        <Row label="Pošta" value={farm?.postOffice || DASH} compact />
      </Card>

      <SectionLabel>Zasebnost</SectionLabel>
      <Card>
        <Pressable
          onPress={handleExport}
          disabled={exporting}
          style={({ pressed }) => [styles.privacyRow, pressed && styles.pressed]}
        >
          <Text style={styles.privacyLabel}>Izvozi moje podatke</Text>
          {exporting && <ActivityIndicator size="small" color={C.green} />}
        </Pressable>
        <View style={styles.divider} />
        <Pressable
          onPress={confirmDelete}
          disabled={deleting}
          style={({ pressed }) => [styles.privacyRow, pressed && styles.pressed]}
        >
          <Text style={[styles.privacyLabel, styles.deleteLabel]}>Izbriši račun</Text>
          {deleting && <ActivityIndicator size="small" color={C.red} />}
        </Pressable>
      </Card>

      <View style={styles.signOutWrap}>
        <PrimaryButton label="Odjava" onPress={signOut} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.green,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontFamily: F.display,
    fontSize: 18,
    color: C.ink,
  },
  role: {
    color: C.faint,
    fontSize: 12,
    fontFamily: F.sans,
  },
  privacyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  privacyLabel: {
    color: C.ink,
    fontSize: 14,
    fontFamily: F.sansMedium,
  },
  deleteLabel: {
    color: C.red,
  },
  divider: {
    height: 1,
    backgroundColor: C.line,
  },
  pressed: {
    opacity: 0.6,
  },
  signOutWrap: {
    marginTop: 24,
  },
});
