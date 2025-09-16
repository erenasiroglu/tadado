import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function GameStartScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();

  const handleStartGame = () => {
    router.push(`/game/playing?category=${category}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FBAA12" />
          </TouchableOpacity>
          <Text style={styles.title}>Ready to Play!</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Narrator Instructions */}
        <View style={styles.instructionsContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Ionicons name="person" size={60} color="#ffffff" />
            </View>
          </View>

          <Text style={styles.instructionsTitle}>Narrator Instructions</Text>
          <Text style={styles.instructionsDescription}>
            You will describe the word on the card without saying it directly. Use gestures, synonyms, and creative descriptions to help your team guess the word!
          </Text>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Important Rules:</Text>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>Don&apos;t say the word on the card</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>Don&apos;t say any forbidden words listed</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>Use gestures and creative descriptions</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>You have 60 seconds per round</Text>
            </View>
          </View>
        </View>

        {/* Start Game Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.startGameButton}
            onPress={handleStartGame}
          >
            <Ionicons name="play" size={24} color="#2a0a3b" />
            <Text style={styles.startGameButtonText}>
              Start Game
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tadado.primary,
    paddingTop: 44, // Status bar height
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
  },
  title: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.xl,
    color: "#FBAA12",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  instructionsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  instructionsTitle: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["2xl"],
    color: "#FBAA12",
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  instructionsDescription: {
    ...Typography.body.regular,
    fontSize: FontSizes.lg,
    color: "#ffffff",
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 24,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  tipsContainer: {
    backgroundColor: "#1a0a2b",
    borderRadius: 20,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    width: "100%",
  },
  tipsTitle: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
    color: "#FBAA12",
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  tipText: {
    ...Typography.body.regular,
    fontSize: FontSizes.base,
    color: "#ffffff",
    opacity: 0.8,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingVertical: Spacing.xl,
  },
  startGameButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBAA12",
    borderRadius: 24,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  startGameButtonText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.xl,
    color: "#2a0a3b",
  },
});
