import { Fraunces_400Regular } from "@expo-google-fonts/fraunces/400Regular";
import { Fraunces_500Medium } from "@expo-google-fonts/fraunces/500Medium";
import { Fraunces_600SemiBold } from "@expo-google-fonts/fraunces/600SemiBold";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono/500Medium";
import { JetBrainsMono_600SemiBold } from "@expo-google-fonts/jetbrains-mono/600SemiBold";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";

import { C } from "@/constants/theme";
import * as api from "@/lib/api";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { registerForPushNotificationsAsync, setupNotifications } from "@/lib/notifications";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
  });

  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <AuthProvider>
      <AppShell fontsLoaded={fontsLoaded} />
    </AuthProvider>
  );
}

function AppShell({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { user, token, needsFarmSetup, isLoading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const ready = fontsLoaded && !authLoading;

  // Once authenticated (and past farm setup), register this device for push so
  // the server can deliver reminders and live event-sync notifications.
  useEffect(() => {
    if (!user || !token || needsFarmSetup) return;
    registerForPushNotificationsAsync().then((pushToken) => {
      if (pushToken) {
        api.registerPushToken(token, { token: pushToken, platform: Platform.OS }).catch(() => {});
      }
    });
  }, [user, token, needsFarmSetup]);

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const inAuthGroup = segments[0] === "login" || segments[0] === "register";
    const onFarmSetup = segments[0] === "farm-setup";
    if (!user && !inAuthGroup) {
      router.replace("/login");
    } else if (user && needsFarmSetup && !onFarmSetup) {
      router.replace("/farm-setup");
    } else if (user && !needsFarmSetup && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [ready, user, needsFarmSetup, segments, router]);

  if (!ready) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="animal/[id]" />
        <Stack.Screen name="animal/new" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="farm-setup" />
      </Stack>
    </>
  );
}
