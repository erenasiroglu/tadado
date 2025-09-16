import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface GameStatsProps {
  cardsGuessed: number;
  cardsPassed: number;
  cardsFailed: number;
  currentStreak: number;
  bestStreak: number;
}

export function GameStats({
  cardsGuessed,
  cardsPassed,
  cardsFailed,
  currentStreak,
  bestStreak,
}: GameStatsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Guessed</Text>
          <Text style={[styles.statValue, styles.guessedValue]}>{cardsGuessed}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Passed</Text>
          <Text style={[styles.statValue, styles.passedValue]}>{cardsPassed}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Failed</Text>
          <Text style={[styles.statValue, styles.failedValue]}>{cardsFailed}</Text>
        </View>
      </View>

      <View style={styles.streakRow}>
        <View style={styles.streakItem}>
          <Text style={styles.streakLabel}>Current Streak</Text>
          <Text style={[styles.streakValue, styles.currentStreakValue]}>
            {currentStreak}
          </Text>
        </View>
        
        <View style={styles.streakItem}>
          <Text style={styles.streakLabel}>Best Streak</Text>
          <Text style={[styles.streakValue, styles.bestStreakValue]}>
            {bestStreak}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a0a2b",
    borderRadius: 16,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: Spacing.sm,
  },
  statLabel: {
    ...Typography.body.medium,
    fontSize: FontSizes.sm,
    color: "#ffffff",
    opacity: 0.8,
    marginBottom: Spacing.xs,
  },
  statValue: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.xl,
  },
  guessedValue: {
    color: "#4CAF50",
  },
  passedValue: {
    color: "#FF9800",
  },
  failedValue: {
    color: "#F44336",
  },
  streakRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#2a0a3b",
  },
  streakItem: {
    alignItems: "center",
    flex: 1,
  },
  streakLabel: {
    ...Typography.body.medium,
    fontSize: FontSizes.sm,
    color: "#ffffff",
    opacity: 0.8,
    marginBottom: Spacing.xs,
  },
  streakValue: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
  },
  currentStreakValue: {
    color: "#2196F3",
  },
  bestStreakValue: {
    color: "#FBAA12",
  },
});
