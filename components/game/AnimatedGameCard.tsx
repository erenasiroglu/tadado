import { FontSizes, Typography } from "@/constants/Typography";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AnimatedGameCardProps {
  word: string;
  forbiddenWords: string[];
  difficulty: number;
  isRevealed: boolean;
  onReveal: () => void;
  onAction: (action: 'correct' | 'pass' | 'skip') => void;
  isAnimating?: boolean;
}

export function AnimatedGameCard({
  word,
  forbiddenWords,
  difficulty,
  isRevealed,
  onReveal,
  onAction,
  isAnimating = false,
}: AnimatedGameCardProps) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    animateIn();
  }, []);

  useEffect(() => {
    if (isAnimating) {
      animateCardChange();
    }
  }, [isAnimating]);

  const animateIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
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
    ]).start();
  };

  const animateCardChange = () => {
    // First animate out
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset and animate in
      scaleAnim.setValue(0.8);
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      animateIn();
    });
  };

  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const handleReveal = () => {
    flipCard();
    onReveal();
  };

  const handleAction = (action: 'correct' | 'pass' | 'skip') => {
    // Pulse animation for action
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onAction(action);
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return "#4CAF50";
      case 2: return "#FF9800";
      case 3: return "#F44336";
      default: return "#4CAF50";
    }
  };

  const getDifficultyText = (level: number) => {
    switch (level) {
      case 1: return "Easy";
      case 2: return "Medium";
      case 3: return "Hard";
      default: return "Easy";
    }
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: Animated.multiply(scaleAnim, pulseAnim) },
            { translateY: slideAnim },
          ],
          opacity: fadeAnim,
        },
      ]}
    >
      {/* Difficulty Badge */}
      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) }]}>
        <Text style={styles.difficultyText}>{getDifficultyText(difficulty)}</Text>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        {!isRevealed ? (
          <Animated.View
            style={[
              styles.cardSide,
              {
                transform: [{ rotateY: frontInterpolate }],
              },
            ]}
          >
            <View style={styles.cardFront}>
              <Ionicons name="help-circle" size={80} color="#FBAA12" />
              <Text style={styles.revealText}>Tap to reveal the card</Text>
              <TouchableOpacity style={styles.revealButton} onPress={handleReveal}>
                <Ionicons name="eye" size={24} color="#2a0a3b" />
                <Text style={styles.revealButtonText}>Reveal Card</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              styles.cardSide,
              {
                transform: [{ rotateY: backInterpolate }],
              },
            ]}
          >
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
          </Animated.View>
        )}
      </View>

      {/* Action Buttons */}
      {isRevealed && (
        <Animated.View
          style={[
            styles.actionButtons,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.actionButton, styles.correctButton]}
            onPress={() => handleAction('correct')}
          >
            <Ionicons name="checkmark" size={24} color="#ffffff" />
            <Text style={styles.actionButtonText}>Correct</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.passButton]}
            onPress={() => handleAction('pass')}
          >
            <Ionicons name="arrow-forward" size={24} color="#ffffff" />
            <Text style={styles.actionButtonText}>Pass</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.skipButton]}
            onPress={() => handleAction('skip')}
          >
            <Ionicons name="close" size={24} color="#ffffff" />
            <Text style={styles.actionButtonText}>Skip</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
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
    backfaceVisibility: "hidden",
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
  cardSide: {
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
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
