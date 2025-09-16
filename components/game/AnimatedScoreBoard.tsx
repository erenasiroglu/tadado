import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface AnimatedScoreBoardProps {
  team1Score: number;
  team2Score: number;
  currentTeam: number;
  timeLeft: number;
  round: number;
  totalRounds: number;
  isAnimating?: boolean;
}

export function AnimatedScoreBoard({
  team1Score,
  team2Score,
  currentTeam,
  timeLeft,
  round,
  totalRounds,
  isAnimating = false,
}: AnimatedScoreBoardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const score1Anim = useRef(new Animated.Value(1)).current;
  const score2Anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    animateIn();
  }, []);

  useEffect(() => {
    if (isAnimating) {
      animateScoreChange();
    }
  }, [team1Score, team2Score, isAnimating]);

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateScoreChange = () => {
    // Pulse animation for score change
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate individual scores
    if (currentTeam === 1) {
      Animated.sequence([
        Animated.timing(score1Anim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(score1Anim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.timing(score2Anim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(score2Anim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (timeLeft: number) => {
    if (timeLeft <= 10) return "#F44336"; // Red
    if (timeLeft <= 30) return "#FF9800"; // Orange
    return "#4CAF50"; // Green
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: Animated.multiply(scaleAnim, pulseAnim) },
          ],
        },
      ]}
    >
      {/* Team 1 Score */}
      <Animated.View
        style={[
          styles.scoreItem,
          currentTeam === 1 && styles.activeTeam,
          {
            transform: [{ scale: score1Anim }],
          },
        ]}
      >
        <Text style={styles.teamLabel}>Team 1</Text>
        <Animated.Text
          style={[
            styles.scoreValue,
            currentTeam === 1 && styles.activeScore,
            {
              transform: [{ scale: score1Anim }],
            },
          ]}
        >
          {team1Score}
        </Animated.Text>
      </Animated.View>

      {/* Timer and Round Info */}
      <View style={styles.centerInfo}>
        <Animated.Text
          style={[
            styles.timerText,
            {
              color: getTimerColor(timeLeft),
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {formatTime(timeLeft)}
        </Animated.Text>
        <Text style={styles.roundText}>
          Round {round}/{totalRounds}
        </Text>
      </View>

      {/* Team 2 Score */}
      <Animated.View
        style={[
          styles.scoreItem,
          currentTeam === 2 && styles.activeTeam,
          {
            transform: [{ scale: score2Anim }],
          },
        ]}
      >
        <Text style={styles.teamLabel}>Team 2</Text>
        <Animated.Text
          style={[
            styles.scoreValue,
            currentTeam === 2 && styles.activeScore,
            {
              transform: [{ scale: score2Anim }],
            },
          ]}
        >
          {team2Score}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
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
    marginBottom: Spacing.xs,
  },
  roundText: {
    ...Typography.body.medium,
    fontSize: FontSizes.sm,
    color: "#ffffff",
    opacity: 0.8,
  },
});
