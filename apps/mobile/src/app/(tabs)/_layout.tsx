import { Tabs } from "expo-router";
import { CalendarDays, Droplet, Home, Tag, User, Wallet } from "lucide-react-native";

import { C, F } from "@/constants/theme";

// Milk and Finance still run on mock data, so keep their tabs out of the
// production build. The routes stay navigable (e.g. the home quick actions)
// in every build — only the tab-bar buttons are hidden in production.
const isProduction = process.env.EXPO_PUBLIC_ENV === "production";
const hiddenInProd = isProduction ? null : undefined;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.green,
        tabBarInactiveTintColor: C.faint,
        tabBarStyle: {
          backgroundColor: C.card,
          borderTopWidth: 1,
          borderTopColor: C.line,
        },
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontFamily: F.sansMedium,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Domov",
          tabBarIcon: ({ color, focused }) => <Home size={20} color={color} strokeWidth={focused ? 2.4 : 1.8} />,
        }}
      />
      <Tabs.Screen
        name="animals"
        options={{
          title: "Živali",
          tabBarIcon: ({ color, focused }) => <Tag size={20} color={color} strokeWidth={focused ? 2.4 : 1.8} />,
        }}
      />
      <Tabs.Screen
        name="milk"
        options={{
          title: "Mleko",
          href: hiddenInProd,
          tabBarIcon: ({ color, focused }) => <Droplet size={20} color={color} strokeWidth={focused ? 2.4 : 1.8} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Koledar",
          tabBarIcon: ({ color, focused }) => <CalendarDays size={20} color={color} strokeWidth={focused ? 2.4 : 1.8} />,
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: "Finance",
          href: hiddenInProd,
          tabBarIcon: ({ color, focused }) => <Wallet size={20} color={color} strokeWidth={focused ? 2.4 : 1.8} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => <User size={20} color={color} strokeWidth={focused ? 2.4 : 1.8} />,
        }}
      />
    </Tabs>
  );
}
