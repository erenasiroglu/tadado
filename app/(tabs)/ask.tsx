import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import { useLanguage } from "@/contexts/LanguageContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AskScreen() {
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("ask.title")}</Text>
          <Text style={styles.subtitle}>{t("ask.subtitle")}</Text>
        </View>

        <View style={styles.comingSoonContainer}>
          <View style={styles.comingSoonCard}>
            <Text style={styles.comingSoonTitle}>{t("ask.comingSoon")}</Text>
            <Text style={styles.comingSoonDescription}>
              {t("ask.comingSoonDescription")}
            </Text>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>💕</Text>
                <Text style={styles.featureText}>{t("ask.feature1")}</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>❓</Text>
                <Text style={styles.featureText}>{t("ask.feature2")}</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>💬</Text>
                <Text style={styles.featureText}>{t("ask.feature3")}</Text>
              </View>
            </View>
          </View>
        </View>
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
    padding: Spacing.lg,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["3xl"],
    color: "#FBAA12",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body.regular,
    fontSize: FontSizes.lg,
    color: "#ffffff",
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 24,
  },
  comingSoonContainer: {
    alignItems: "center",
  },
  comingSoonCard: {
    backgroundColor: "#1a0a2b",
    borderRadius: 24,
    padding: Spacing.xl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: 350,
    width: "100%",
  },
  comingSoonTitle: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["2xl"],
    color: "#FBAA12",
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  comingSoonDescription: {
    ...Typography.body.regular,
    fontSize: FontSizes.base,
    color: "#ffffff",
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  featuresList: {
    width: "100%",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  featureText: {
    ...Typography.body.medium,
    fontSize: FontSizes.base,
    color: "#ffffff",
    flex: 1,
    lineHeight: 20,
  },
});
