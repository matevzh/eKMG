import { isRunningInExpoGo } from "expo";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { Platform } from "react-native";

import type * as NotificationsApi from "expo-notifications";

const CHANNEL_ID = "opravila";

/**
 * Merely importing expo-notifications throws in Expo Go on Android (its
 * notification support was removed from Expo Go in SDK 53), so the module is
 * required lazily and only where it works. On Android, push notifications need
 * a development build (`npx expo run:android`).
 */
export function remindersSupported(): boolean {
  if (Platform.OS === "web") return false;
  if (Platform.OS === "android" && isRunningInExpoGo()) return false;
  return true;
}

function getApi(): typeof NotificationsApi | null {
  if (!remindersSupported()) return null;
  return require("expo-notifications");
}

/** Call once at app start: foreground presentation + Android channel. Does NOT prompt for permission. */
export function setupNotifications() {
  const api = getApi();
  if (!api) return;

  api.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === "android") {
    api.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Opomniki za opravila",
      importance: api.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

export async function ensureNotificationPermission(): Promise<boolean> {
  const api = getApi();
  if (!api) return false;
  const current = await api.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const requested = await api.requestPermissionsAsync();
  return requested.granted;
}

/**
 * Registers this device for remote push and returns its Expo push token, or
 * null when push isn't available (simulator, permission denied, or no EAS
 * projectId configured yet). Register the returned token with the backend so
 * the server can send reminders and live event-sync notifications.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  const api = getApi();
  if (!api) return null;

  if (!Device.isDevice) {
    console.warn("Push notifications require a physical device.");
    return null;
  }

  if (!(await ensureNotificationPermission())) return null;

  // Real Expo push tokens require the EAS projectId from app config.
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    (Constants as { easConfig?: { projectId?: string } }).easConfig?.projectId;

  try {
    const { data } = await api.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
    return data;
  } catch (err) {
    console.warn("Failed to obtain Expo push token:", err);
    return null;
  }
}

/**
 * Subscribes to incoming pushes and invokes `onEvent` whenever a calendar
 * event push arrives (type "event.*"), so the calendar can refresh. Returns an
 * unsubscribe function.
 */
export function addEventPushListener(onEvent: () => void): () => void {
  const api = getApi();
  if (!api) return () => {};
  const sub = api.addNotificationReceivedListener((notification) => {
    const type = notification.request.content.data?.type;
    if (typeof type === "string" && type.startsWith("event.")) onEvent();
  });
  return () => sub.remove();
}
