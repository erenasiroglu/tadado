import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
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
  ];

  const handleModeSelect = (modeId: string) => {
    if (modeId === "team-mode") {
      router.push(`/game/team-setup?category=${category}`);
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
          details: "Explore the language of love! Perfect for couples, date nights, and romantic moments. Test how well you know each other with intimate and playful questions.",
          exampleCards: [
            { word: "First Kiss", forbidden: ["Lips", "Mouth", "Touch"] },
            { word: "Wedding Ring", forbidden: ["Marriage", "Finger", "Gold"] },
            { word: "Candlelight Dinner", forbidden: ["Restaurant", "Food", "Date"] }
          ]
        };
      case "travel":
        return {
          title: t("cards.travel"),
          description: t("cards.travelDescription"),
          icon: "airplane",
          color: "#2196F3",
          details: "Pack your bags and explore the world! From exotic destinations to travel essentials, discover new places and cultures through fun guessing games.",
          exampleCards: [
            { word: "Eiffel Tower", forbidden: ["Paris", "France", "Tall"] },
            { word: "Suitcase", forbidden: ["Travel", "Clothes", "Pack"] },
            { word: "Passport", forbidden: ["Travel", "Document", "Country"] }
          ]
        };
      case "adventure":
        return {
          title: t("cards.adventure"),
          description: t("cards.adventureDescription"),
          icon: "compass",
          color: "#FF9800",
          details: "Ready for an adrenaline rush? Challenge yourself with extreme sports, outdoor activities, and thrilling adventures that will get your heart pumping!",
          exampleCards: [
            { word: "Rock Climbing", forbidden: ["Mountain", "Rope", "High"] },
            { word: "Skydiving", forbidden: ["Jump", "Parachute", "Sky"] },
            { word: "White Water Rafting", forbidden: ["River", "Boat", "Water"] }
          ]
        };
      case "party":
        return {
          title: t("cards.party"),
          description: t("cards.partyDescription"),
          icon: "wine",
          color: "#9C27B0",
          details: "Let's get the party started! Wild, fun, and energetic cards perfect for celebrations, night outs, and getting everyone laughing and dancing!",
          exampleCards: [
            { word: "Dance Floor", forbidden: ["Music", "Party", "Move"] },
            { word: "Cocktail", forbidden: ["Drink", "Alcohol", "Glass"] },
            { word: "Confetti", forbidden: ["Celebrate", "Colorful", "Throw"] }
          ]
        };
      default:
        return {
          title: t("game.selectMode"),
          description: t("game.modeInfo"),
          icon: "game-controller",
          color: "#FBAA12",
          details: "Choose your adventure and start playing!",
          exampleCards: []
        };
    }
  };

  const categoryInfo = getCategoryInfo(category || "");

  return (
    <View style={styles.container}>
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

        {/* Category Details */}
        <View style={styles.categoryDetails}>
          <Text style={styles.categoryDescription}>{categoryInfo.description}</Text>
          <Text style={styles.categoryDetailsText}>{categoryInfo.details}</Text>
        </View>

        {/* Example Cards */}
        {categoryInfo.exampleCards.length > 0 && (
          <View style={styles.exampleCardsContainer}>
            <Text style={styles.exampleCardsTitle}>Example Cards</Text>
            <View style={styles.exampleCards}>
              {categoryInfo.exampleCards.map((card, index) => (
                <View key={index} style={[styles.exampleCard, { borderColor: categoryInfo.color }]}>
                  <Text style={[styles.exampleCardWord, { color: categoryInfo.color }]}>
                    {card.word}
                  </Text>
                  <View style={styles.exampleForbiddenWords}>
                    <Text style={styles.exampleForbiddenTitle}>Don&apos;t say:</Text>
                    {card.forbidden.map((word, wordIndex) => (
                      <Text key={wordIndex} style={styles.exampleForbiddenWord}>
                        {word}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Game Mode */}
        <View style={styles.modesContainer}>
          {gameModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={styles.modeCard}
              onPress={() => handleModeSelect(mode.id)}
            >
              <View style={styles.modeHeader}>
                <View style={styles.modeIconContainer}>
                  <Ionicons
                    name={mode.icon as any}
                    size={24}
                    color="#FBAA12"
                  />
                </View>
                <View style={styles.modeInfo}>
                  <Text style={styles.modeTitle}>{mode.title}</Text>
                  <Text style={styles.modeDescription}>{mode.description}</Text>
                  <Text style={styles.playerCount}>
                    {mode.minPlayers}-{mode.maxPlayers} players
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#FBAA12" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tadado.primary,
    paddingTop: 44, // Status bar height
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2a0a3b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  title: {
    ...Typography.heading.semiBold,
    fontSize: 18,
    color: "#FBAA12",
  },
  placeholder: {
    width: 32,
  },
  categoryDetails: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  categoryDescription: {
    ...Typography.body.semiBold,
    fontSize: 16,
    color: "#FBAA12",
    textAlign: "center",
    marginBottom: 8,
  },
  categoryDetailsText: {
    ...Typography.body.regular,
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.8,
    textAlign: "center",
    lineHeight: 20,
  },
  exampleCardsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  exampleCardsTitle: {
    ...Typography.heading.semiBold,
    fontSize: 16,
    color: "#FBAA12",
    marginBottom: 12,
    textAlign: "center",
  },
  exampleCards: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  exampleCard: {
    backgroundColor: "#1a0a2b",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    minWidth: 100,
    maxWidth: 120,
  },
  exampleCardWord: {
    ...Typography.heading.semiBold,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  exampleForbiddenWords: {
    alignItems: "center",
  },
  exampleForbiddenTitle: {
    ...Typography.body.medium,
    fontSize: 10,
    color: "#ffffff",
    opacity: 0.7,
    marginBottom: 4,
  },
  exampleForbiddenWord: {
    ...Typography.body.regular,
    fontSize: 9,
    color: "#ffffff",
    opacity: 0.6,
    textAlign: "center",
  },
  modesContainer: {
    paddingHorizontal: 16,
  },
  modeCard: {
    backgroundColor: "#1a0a2b",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2a0a3b",
    alignItems: "center",
    justifyContent: "center",
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    ...Typography.heading.semiBold,
    fontSize: 16,
    color: "#FBAA12",
    marginBottom: 4,
  },
  modeDescription: {
    ...Typography.body.regular,
    fontSize: 13,
    color: "#ffffff",
    opacity: 0.8,
    marginBottom: 4,
    lineHeight: 18,
  },
  playerCount: {
    ...Typography.body.medium,
    fontSize: 12,
    color: "#FBAA12",
    opacity: 0.7,
  },
});
