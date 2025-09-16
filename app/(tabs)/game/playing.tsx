import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import { useGame } from "@/contexts/GameContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function PlayingScreen() {
  const { t } = useLanguage();
  const { category } = useLocalSearchParams<{ category: string }>();
  const {
    currentSession,
    currentCard,
    timeLeft,
    isPaused,
    cardsGuessed,
    cardsPassed,
    cardsFailed,
    currentStreak,
    bestStreak,
    startGame,
    pauseGame,
    resumeGame,
    handleCardAction,
    nextCard,
    loadGameCards,
  } = useGame();

  const [cardFlipped, setCardFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animation values
  const cardScale = useState(new Animated.Value(0.8))[0];
  const cardOpacity = useState(new Animated.Value(0))[0];
  const cardTranslateY = useState(new Animated.Value(50))[0];
  const buttonScale = useState(new Animated.Value(1))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (currentSession && currentSession.status === 'waiting') {
      console.log('Session found, loading cards...');
      // Load game cards for the selected category
      loadGameCards(currentSession.settings.deckLanguage, category).then(() => {
        console.log('Cards loaded, starting game...');
        startGame();
      }).catch(error => {
        console.error('Error loading cards:', error);
      });
    } else {
      console.log('No session or session not waiting:', currentSession?.status);
    }
  }, [currentSession, startGame, loadGameCards, category]);

  useEffect(() => {
    if (currentCard) {
      animateCardIn();
    }
  }, [currentCard]);

  const animateCardIn = () => {
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateCardOut = () => {
    Animated.parallel([
      Animated.timing(cardScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset and animate in
      cardScale.setValue(0.8);
      cardOpacity.setValue(0);
      cardTranslateY.setValue(50);
      animateCardIn();
    });
  };

  const handleCardReveal = () => {
    setCardFlipped(true);
  };

  const handleCardActionWrapper = (action: 'correct' | 'pass' | 'skip') => {
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

    handleCardAction(action);
    setCardFlipped(false);
    animateCardOut();
  };

  const togglePause = () => {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (timeLeft: number) => {
    if (timeLeft <= 10) return "#F44336";
    if (timeLeft <= 30) return "#FF9800";
    return "#4CAF50";
  };

  if (!currentSession) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t("common.loading")}</Text>
          <Text style={styles.loadingSubtext}>Creating game session...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentCard) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t("common.loading")}</Text>
          <Text style={styles.loadingSubtext}>Loading game cards...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push("/(tabs)/index")}
        >
          <Ionicons name="home" size={24} color="#FBAA12" />
        </TouchableOpacity>
        
        <View style={styles.gameInfo}>
          <Text style={styles.roundText}>
            Round {currentSession.currentRound}/{currentSession.settings.totalRounds}
          </Text>
          <Text style={styles.teamText}>
            Team {currentSession.currentTeam}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={togglePause}
        >
          <Ionicons 
            name={isPaused ? "play" : "pause"} 
            size={24} 
            color="#FBAA12" 
          />
        </TouchableOpacity>
      </View>

      {/* Score Board */}
      <View style={styles.scoreBoard}>
        <View style={[styles.scoreItem, currentSession.currentTeam === 1 && styles.activeScore]}>
          <Text style={styles.scoreLabel}>Team 1</Text>
          <Text style={styles.scoreValue}>{currentSession.totalScoreTeam1}</Text>
        </View>
        
        <View style={styles.timerContainer}>
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
        </View>
        
        <View style={[styles.scoreItem, currentSession.currentTeam === 2 && styles.activeScore]}>
          <Text style={styles.scoreLabel}>Team 2</Text>
          <Text style={styles.scoreValue}>{currentSession.totalScoreTeam2}</Text>
        </View>
      </View>

      {/* Game Card */}
      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.gameCard,
            {
              transform: [
                { scale: cardScale },
                { translateY: cardTranslateY },
              ],
              opacity: cardOpacity,
            },
          ]}
        >
          {!cardFlipped ? (
            <View style={styles.cardFront}>
              <View style={styles.cardIcon}>
                <Ionicons name="help-circle" size={80} color="#FBAA12" />
              </View>
              <Text style={styles.revealText}>Tap to reveal the word</Text>
              <TouchableOpacity style={styles.revealButton} onPress={handleCardReveal}>
                <Ionicons name="eye" size={20} color="#2a0a3b" />
                <Text style={styles.revealButtonText}>Reveal</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cardBack}>
              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>
                  {currentCard.difficulty === 1 ? 'Easy' : currentCard.difficulty === 2 ? 'Medium' : 'Hard'}
                </Text>
              </View>
              
              <Text style={styles.wordText}>{currentCard.word}</Text>
              
              <View style={styles.forbiddenContainer}>
                <Text style={styles.forbiddenTitle}>Don't say:</Text>
                <View style={styles.forbiddenWords}>
                  {currentCard.forbiddenWords.map((word, index) => (
                    <Text key={index} style={styles.forbiddenWord}>
                      {word}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      </View>

      {/* Action Buttons */}
      {cardFlipped && (
        <Animated.View
          style={[
            styles.actionButtons,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.actionButton, styles.correctButton]}
            onPress={() => handleCardActionWrapper('correct')}
          >
            <Ionicons name="checkmark" size={24} color="#ffffff" />
            <Text style={styles.actionButtonText}>Correct</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.passButton]}
            onPress={() => handleCardActionWrapper('pass')}
          >
            <Ionicons name="arrow-forward" size={24} color="#ffffff" />
            <Text style={styles.actionButtonText}>Pass</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.skipButton]}
            onPress={() => handleCardActionWrapper('skip')}
          >
            <Ionicons name="close" size={24} color="#ffffff" />
            <Text style={styles.actionButtonText}>Skip</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tadado.primary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    ...Typography.body.regular,
    fontSize: FontSizes.lg,
    color: "#FBAA12",
    textAlign: "center",
  },
  loadingSubtext: {
    ...Typography.body.regular,
    fontSize: FontSizes.base,
    color: "#ffffff",
    textAlign: "center",
    opacity: 0.7,
    marginTop: Spacing.sm,
  },
  
  // Top Header
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: "rgba(26, 10, 43, 0.8)",
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(251, 170, 18, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  gameInfo: {
    alignItems: "center",
  },
  roundText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.base,
    color: "#FBAA12",
  },
  teamText: {
    ...Typography.body.regular,
    fontSize: FontSizes.sm,
    color: "#ffffff",
    opacity: 0.8,
  },

  // Score Board
  scoreBoard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a0a2b",
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    borderRadius: 20,
    padding: Spacing.lg,
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
  activeScore: {
    backgroundColor: "rgba(251, 170, 18, 0.1)",
  },
  scoreLabel: {
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
  timerContainer: {
    alignItems: "center",
    paddingHorizontal: Spacing.md,
  },
  timerText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["3xl"],
  },

  // Game Card
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  gameCard: {
    width: width * 0.9,
    maxWidth: 400,
    aspectRatio: 0.7,
    backgroundColor: "#1a0a2b",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    overflow: "hidden",
  },
  cardFront: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  cardIcon: {
    marginBottom: Spacing.lg,
  },
  revealText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.xl,
    color: "#FBAA12",
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  revealButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBAA12",
    borderRadius: 24,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  revealButtonText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.base,
    color: "#2a0a3b",
  },
  cardBack: {
    flex: 1,
    padding: Spacing.xl,
    position: "relative",
  },
  difficultyBadge: {
    position: "absolute",
    top: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: "#4CAF50",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  difficultyText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.sm,
    color: "#ffffff",
  },
  wordText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["4xl"],
    color: "#FBAA12",
    textAlign: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  forbiddenContainer: {
    alignItems: "center",
  },
  forbiddenTitle: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.lg,
    color: "#ffffff",
    marginBottom: Spacing.md,
  },
  forbiddenWords: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  forbiddenWord: {
    ...Typography.body.regular,
    fontSize: FontSizes.base,
    color: "#ffffff",
    opacity: 0.8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
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
    ...Typography.heading.semiBold,
    fontSize: FontSizes.base,
    color: "#ffffff",
  },
});