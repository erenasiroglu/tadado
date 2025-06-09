import { NotificationProvider } from "@/lib/NotificationContext";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <NotificationProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#1A1A1A",
          },
          animation: "fade",
          animationDuration: 200,
        }}
      />
    </NotificationProvider>
  );
}
