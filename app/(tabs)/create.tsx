import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create</Text>
        <Text style={styles.subtitle}>Create your own decks...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tadado.primary,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  title: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["4xl"],
    color: "#FBAA12",
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body.regular,
    fontSize: FontSizes.lg,
    color: "#ffffff",
    opacity: 0.8,
  },
});
