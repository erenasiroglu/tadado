import { Stack } from "expo-router";
import React from "react";

export default function GameLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "card",
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="team-setup" />
      <Stack.Screen name="game-settings" />
      <Stack.Screen name="game-start" />
      <Stack.Screen name="playing" />
    </Stack>
  );
}