import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ScoreBoardProps {
  team1Score: number;
  team2Score: number;
  currentTeam: number;
  timeLeft: number;
  round: number;
  totalRounds: number;
}

export function ScoreBoard({
  team1Score,
  team2Score,
  currentTeam,
  timeLeft,
  round,
  totalRounds,
}: ScoreBoardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Team 1 Score */}
      <View style={[styles.scoreItem, currentTeam === 1 && styles.activeTeam]}>
        <Text style={styles.teamLabel}>Team 1</Text>
        <Text style={[styles.scoreValue, currentTeam === 1 && styles.activeScore]}>
          {team1Score}
        </Text>
      </View>

      {/* Timer and Round Info */}
      <View style={styles.centerInfo}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        <Text style={styles.roundText}>
          Round {round}/{totalRounds}
        </Text>
      </View>

      {/* Team 2 Score */}
      <View style={[styles.scoreItem, currentTeam === 2 && styles.activeTeam]}>
        <Text style={styles.teamLabel}>Team 2</Text>
        <Text style={[styles.scoreValue, currentTeam === 2 && styles.activeScore]}>
          {team2Score}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a0a2b",
    borderRadius: 16,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scoreItem: {
    alignItems: "center",
    flex: 1,
    padding: Spacing.sm,
    borderRadius: 12,
  },
  activeTeam: {
    backgroundColor: "#2a0a3b",
  },
  teamLabel: {
    ...Typography.body.medium,
    fontSize: FontSizes.sm,
    color: "#ffffff",
    opacity: 0.8,
    marginBottom: Spacing.xs,
  },
  scoreValue: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["2xl"],
    color: "#FBAA12",
  },
  activeScore: {
    color: "#4CAF50",
  },
  centerInfo: {
    alignItems: "center",
    paddingHorizontal: Spacing.md,
  },
  timerText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["3xl"],
    color: "#4CAF50",
    marginBottom: Spacing.xs,
  },
  roundText: {
    ...Typography.body.medium,
    fontSize: FontSizes.sm,
    color: "#ffffff",
    opacity: 0.8,
  },
});
