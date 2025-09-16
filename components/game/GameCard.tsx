import { FontSizes, Typography } from "@/constants/Typography";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface GameCardProps {
  word: string;
  forbiddenWords: string[];
  difficulty: number;
  isRevealed: boolean;
  onReveal: () => void;
  onAction: (action: 'correct' | 'pass' | 'skip') => void;
}

export function GameCard({
  word,
  forbiddenWords,
  difficulty,
  isRevealed,
  onReveal,
  onAction,
}: GameCardProps) {
  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1:
        return "#4CAF50"; // Easy - Green
      case 2:
        return "#FF9800"; // Medium - Orange
      case 3:
        return "#F44336"; // Hard - Red
      default:
        return "#4CAF50";
    }
  };

  const getDifficultyText = (level: number) => {
    switch (level) {
      case 1:
        return "Easy";
      case 2:
        return "Medium";
      case 3:
        return "Hard";
      default:
        return "Easy";
    }
  };

  return (
    <View style={styles.container}>
      {/* Difficulty Badge */}
      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) }]}>
        <Text style={styles.difficultyText}>{getDifficultyText(difficulty)}</Text>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        {!isRevealed ? (
          <View style={styles.cardFront}>
            <Ionicons name="help-circle" size={80} color="#FBAA12" />
            <Text style={styles.revealText}>Tap to reveal the card</Text>
            <TouchableOpacity style={styles.revealButton} onPress={onReveal}>
              <Ionicons name="eye" size={24} color="#2a0a3b" />
              <Text style={styles.revealButtonText}>Reveal Card</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cardBack}>
            <Text style={styles.wordText}>{word}</Text>
            <View style={styles.forbiddenContainer}>
              <Text style={styles.forbiddenTitle}>Forbidden Words</Text>
              {forbiddenWords.map((word, index) => (
                <Text key={index} style={styles.forbiddenWord}>
                  • {word}
                </Text>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      {isRevealed && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.correctButton]}
            onPress={() => onAction('correct')}
          >
            <Ionicons name="checkmark" size={24} color="#ffffff" />
            <Text style={styles.actionButtonText}>Correct</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.passButton]}
            onPress={() => onAction('pass')}
          >
            <Ionicons name="arrow-forward" size={24} color="#ffffff" />
            <Text style={styles.actionButtonText}>Pass</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.skipButton]}
            onPress={() => onAction('skip')}
          >
            <Ionicons name="close" size={24} color="#ffffff" />
            <Text style={styles.actionButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a0a2b",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    minHeight: 300,
  },
  difficultyBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  difficultyText: {
    ...Typography.body.semiBold,
    fontSize: 12,
    color: "#ffffff",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardFront: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  revealText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
    color: "#FBAA12",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  revealButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBAA12",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  revealButtonText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.base,
    color: "#2a0a3b",
  },
  cardBack: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  wordText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["3xl"],
    color: "#FBAA12",
    textAlign: "center",
    marginBottom: 24,
  },
  forbiddenContainer: {
    alignItems: "center",
  },
  forbiddenTitle: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.base,
    color: "#ffffff",
    marginBottom: 12,
  },
  forbiddenWord: {
    ...Typography.body.regular,
    fontSize: FontSizes.sm,
    color: "#ffffff",
    opacity: 0.8,
    textAlign: "center",
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 12,
    gap: 8,
  },
  correctButton: {
    backgroundColor: "#4CAF50",
  },
  passButton: {
    backgroundColor: "#FF9800",
  },
  skipButton: {
    backgroundColor: "#F44336",
  },
  actionButtonText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.sm,
    color: "#ffffff",
  },
});
