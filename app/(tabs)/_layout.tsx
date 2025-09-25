import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

// Layout components removed for simplicity
import { useLanguage } from "@/contexts/LanguageContext";

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FBAA12",
        tabBarInactiveTintColor: "#ffffff",
        headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: "#150527",
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
