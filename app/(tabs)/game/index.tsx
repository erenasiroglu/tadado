import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import { useLanguage } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GameModeScreen() {
  const { t } = useLanguage();
  const { category } = useLocalSearchParams<{ category: string }>();

  const gameModes = [
    {
      id: "team-mode",
      title: t("game.teamMode"),
      description: t("game.teamModeDescription"),
      icon: "people",
      minPlayers: 4,
      maxPlayers: 20,
      isAvailable: true,
    },
    {
      id: "solo-mode",
      title: t("game.soloMode"),
      description: t("game.soloModeDescription"),
      icon: "person",
      minPlayers: 1,
      maxPlayers: 1,
      isAvailable: false,
    },
    {
      id: "party-mode",
      title: t("game.partyMode"),
      description: t("game.partyModeDescription"),
      icon: "wine",
      minPlayers: 8,
      maxPlayers: 50,
      isAvailable: false,
    },
  ];

  const handleModeSelect = (modeId: string) => {
    if (modeId === "team-mode") {
      router.push(`/(tabs)/game/team-setup?category=${category}`);
    }
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case "romance":
        return {
          title: t("cards.romance"),
          description: t("cards.romanceDescription"),
          icon: "heart",
          color: "#E91E63",
        };
      case "travel":
        return {
          title: t("cards.travel"),
          description: t("cards.travelDescription"),
          icon: "airplane",
          color: "#2196F3",
        };
      case "adventure":
        return {
          title: t("cards.adventure"),
          description: t("cards.adventureDescription"),
          icon: "compass",
          color: "#FF9800",
        };
      case "party":
        return {
          title: t("cards.party"),
          description: t("cards.partyDescription"),
          icon: "wine",
          color: "#9C27B0",
        };
      default:
        return {
          title: t("game.selectMode"),
          description: t("game.modeInfo"),
          icon: "game-controller",
          color: "#FBAA12",
        };
    }
  };

  const categoryInfo = getCategoryInfo(category || "");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FBAA12" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <View style={styles.categoryIcon}>
              <Ionicons name={categoryInfo.icon as any} size={24} color={categoryInfo.color} />
            </View>
            <Text style={styles.title}>{categoryInfo.title}</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        {/* Category Description */}
        <View style={styles.categoryDescription}>
          <Text style={styles.categoryText}>{categoryInfo.description}</Text>
        </View>

        {/* Game Modes */}
        <View style={styles.modesContainer}>
          {gameModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.modeCard,
                !mode.isAvailable && styles.disabledCard,
              ]}
              onPress={() => handleModeSelect(mode.id)}
              disabled={!mode.isAvailable}
            >
              <View style={styles.modeHeader}>
                <View style={styles.modeIconContainer}>
                  <Ionicons
                    name={mode.icon as any}
                    size={32}
                    color={mode.isAvailable ? "#FBAA12" : "#666"}
                  />
                </View>
                <View style={styles.modeInfo}>
                  <Text
                    style={[
                      styles.modeTitle,
                      !mode.isAvailable && styles.disabledText,
                    ]}
                  >
                    {mode.title}
                  </Text>
                  <Text
                    style={[
                      styles.modeDescription,
                      !mode.isAvailable && styles.disabledText,
                    ]}
                  >
                    {mode.description}
                  </Text>
                  <Text
                    style={[
                      styles.playerCount,
                      !mode.isAvailable && styles.disabledText,
                    ]}
                  >
                    {mode.minPlayers === mode.maxPlayers
                      ? `${mode.minPlayers} ${t("game.player")}`
                      : `${mode.minPlayers}-${mode.maxPlayers} ${t("game.players")}`}
                  </Text>
                </View>
                {mode.isAvailable ? (
                  <Ionicons name="chevron-forward" size={24} color="#FBAA12" />
                ) : (
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>
                      {t("game.comingSoon")}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#FBAA12" />
            <Text style={styles.infoText}>{t("game.modeInfo")}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tadado.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2a0a3b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  title: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.xl,
    color: "#FBAA12",
  },
  categoryDescription: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  categoryText: {
    ...Typography.body.regular,
    fontSize: FontSizes.base,
    color: "#ffffff",
    opacity: 0.8,
    textAlign: "center",
    lineHeight: 22,
  },
  placeholder: {
    width: 40,
  },
  modesContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  modeCard: {
    backgroundColor: "#1a0a2b",
    borderRadius: 20,
    padding: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledCard: {
    opacity: 0.5,
  },
  modeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  modeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2a0a3b",
    alignItems: "center",
    justifyContent: "center",
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
    color: "#FBAA12",
    marginBottom: Spacing.xs,
  },
  modeDescription: {
    ...Typography.body.regular,
    fontSize: FontSizes.base,
    color: "#ffffff",
    opacity: 0.8,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  playerCount: {
    ...Typography.body.medium,
    fontSize: FontSizes.sm,
    color: "#FBAA12",
    opacity: 0.7,
  },
  disabledText: {
    color: "#666",
  },
  comingSoonBadge: {
    backgroundColor: "#333",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  comingSoonText: {
    ...Typography.body.medium,
    fontSize: FontSizes.xs,
    color: "#999",
  },
  infoSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a0a3b",
    borderRadius: 16,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  infoText: {
    ...Typography.body.regular,
    fontSize: FontSizes.sm,
    color: "#ffffff",
    opacity: 0.8,
    flex: 1,
    lineHeight: 18,
  },
});
