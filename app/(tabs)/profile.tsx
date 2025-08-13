import { LanguageSelector } from "@/components/forms/LanguageSelector";
import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import { useLanguage } from "@/contexts/LanguageContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { t } = useLanguage();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.languageContainer}>
        <Text style={styles.sectionTitle}>{t("common.language")}</Text>
        <LanguageSelector />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tadado.primary,
  },
  languageContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.xl,
    color: "#FBAA12",
    marginBottom: 12,
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
