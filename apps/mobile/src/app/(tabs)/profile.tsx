import { User } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/screen";
import { Card, PrimaryButton, Row, SectionLabel } from "@/components/ui";
import { C, F } from "@/constants/theme";
import * as api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const DASH = "—";

export default function ProfileScreen() {
  const { user, token, signOut } = useAuth();
  const [profile, setProfile] = useState<api.Profile | null>(null);

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
  signOutWrap: {
    marginTop: 24,
  },
});
