import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import { useGame } from "@/contexts/GameContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

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
    bestStreak,
    startGame,
    pauseGame,
    resumeGame,
    handleCardAction,
    loadGameCards,
  } = useGame();

  const [showGameEnd, setShowGameEnd] = useState(false);
  
  // Animation values
  const cardScale = useState(new Animated.Value(0.8))[0];
  const cardOpacity = useState(new Animated.Value(0))[0];
  const cardTranslateY = useState(new Animated.Value(50))[0];
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

  const animateCardIn = useCallback(() => {
    Animated.sequence([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(cardScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(cardTranslateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [cardScale, cardOpacity, cardTranslateY]);

  useEffect(() => {
    if (currentCard) {
      animateCardIn();
    }
  }, [currentCard, animateCardIn]);

  useEffect(() => {
    if (currentSession?.status === 'finished') {
      setShowGameEnd(true);
    }
  }, [currentSession?.status]);


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


  const handleCardActionWrapper = (action: 'correct' | 'pass' | 'skip') => {
    // Enhanced button animation
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(pulseAnim, {
        toValue: 1,
        tension: 200,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Add haptic feedback for better UX
    setTimeout(() => {
      handleCardAction(action);
      animateCardOut();
    }, 100);
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

  const getCategoryBackgroundColor = (category: string) => {
    switch (category) {
      case "romance":
        return "rgba(255, 44, 122, 0.1)";
      case "travel":
        return "rgba(93, 51, 145, 0.1)";
      case "adventure":
        return "rgba(34, 139, 34, 0.1)";
      case "party":
        return "rgba(255, 165, 0, 0.1)";
      default:
        return "rgba(26, 10, 43, 0.8)";
    }
  };

  // Timer pulse animation when time is running low
  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [timeLeft, pulseAnim]);

  const handlePlayAgain = () => {
    setShowGameEnd(false);
    router.push("/game");
  };

  const handleBackToMenu = () => {
    setShowGameEnd(false);
    router.push("/(tabs)");
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
    <View style={styles.container}>
      {/* Top Header - Simplified */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push("/(tabs)")}
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
      </View>

      {/* Score Board */}
      <View style={styles.scoreBoard}>
        <View style={[styles.scoreItem, currentSession.currentTeam === 1 && styles.activeScore]}>
          <Text style={styles.scoreLabel}>Team 1</Text>
          <Text style={styles.scoreValue}>{currentSession.totalScoreTeam1}</Text>
        </View>
        
        <View style={[styles.scoreItem, currentSession.currentTeam === 2 && styles.activeScore]}>
          <Text style={styles.scoreLabel}>Team 2</Text>
          <Text style={styles.scoreValue}>{currentSession.totalScoreTeam2}</Text>
        </View>
      </View>

      {/* Game Card - Enhanced with category-specific background */}
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
          <View style={[styles.cardBack, { backgroundColor: getCategoryBackgroundColor(category) }]}>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>
                {currentCard.difficulty === 1 ? 'Easy' : currentCard.difficulty === 2 ? 'Medium' : 'Hard'}
              </Text>
            </View>
            
            <Text style={styles.wordText}>{currentCard.word}</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.forbiddenContainer}>
              <Text style={styles.forbiddenTitle}>Don&apos;t say:</Text>
              <View style={styles.forbiddenWords}>
                {currentCard.forbiddenWords.map((word, index) => (
                  <Text key={index} style={styles.forbiddenWord}>
                    {word}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons - Redesigned */}
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
          <View style={styles.buttonIconContainer}>
            <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
          </View>
          <Text style={styles.actionButtonText}>Correct</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleCardActionWrapper('pass')}
        >
          <View style={styles.buttonIconContainer}>
            <Ionicons name="arrow-forward-circle" size={28} color="#FF9800" />
          </View>
          <Text style={styles.actionButtonText}>Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.skipButton]}
          onPress={() => handleCardActionWrapper('skip')}
        >
          <View style={styles.buttonIconContainer}>
            <Ionicons name="close-circle" size={28} color="#F44336" />
          </View>
          <Text style={styles.actionButtonText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Game End Modal */}
      <Modal
        visible={showGameEnd}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGameEnd(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.gameEndContainer}>
            <View style={styles.gameEndHeader}>
              <Ionicons name="trophy" size={60} color="#FBAA12" />
              <Text style={styles.gameEndTitle}>Game Finished!</Text>
            </View>

            <View style={styles.winnerSection}>
              <Text style={styles.winnerText}>
                {currentSession?.totalScoreTeam1 > currentSession?.totalScoreTeam2 
                  ? "Team 1 Wins!" 
                  : "Team 2 Wins!"}
              </Text>
              <Text style={styles.finalScoreText}>
                Final Score: {currentSession?.totalScoreTeam1} - {currentSession?.totalScoreTeam2}
              </Text>
            </View>

            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>Game Statistics</Text>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Cards Guessed:</Text>
                <Text style={styles.statValue}>{cardsGuessed}</Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Cards Passed:</Text>
                <Text style={styles.statValue}>{cardsPassed}</Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Cards Skipped:</Text>
                <Text style={styles.statValue}>{cardsFailed}</Text>
              </View>
              
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Best Streak:</Text>
                <Text style={styles.statValue}>{bestStreak}</Text>
              </View>
            </View>

            <View style={styles.gameEndButtons}>
              <TouchableOpacity
                style={[styles.gameEndButton, styles.playAgainButton]}
                onPress={handlePlayAgain}
              >
                <Ionicons name="refresh" size={20} color="#2a0a3b" />
                <Text style={styles.playAgainText}>Play Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gameEndButton, styles.menuButton]}
                onPress={handleBackToMenu}
              >
                <Ionicons name="home" size={20} color="#FBAA12" />
                <Text style={styles.menuText}>Back to Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tadado.primary,
    paddingTop: 44, // Status bar height
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
  timerContainer: {
    alignItems: "center",
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
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  scoreItem: {
    alignItems: "center",
    flex: 1,
    padding: 8,
    borderRadius: 8,
  },
  activeScore: {
    backgroundColor: "rgba(251, 170, 18, 0.1)",
  },
  scoreLabel: {
    ...Typography.body.medium,
    fontSize: 12,
    color: "#ffffff",
    opacity: 0.8,
    marginBottom: 4,
  },
  scoreValue: {
    ...Typography.heading.semiBold,
    fontSize: 24,
    color: "#FBAA12",
  },
  timerText: {
    ...Typography.heading.semiBold,
    fontSize: 24,
    color: "#FBAA12",
  },

  // Game Card
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  gameCard: {
    width: width * 0.9,
    maxWidth: 320,
    aspectRatio: 0.75,
    backgroundColor: "#1a0a2b",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#FBAA12",
  },
  cardBack: {
    flex: 1,
    padding: 24,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    width: "80%",
    height: 2,
    backgroundColor: "rgba(251, 170, 18, 0.3)",
    marginVertical: 20,
    borderRadius: 1,
  },
  difficultyBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  difficultyText: {
    ...Typography.body.semiBold,
    fontSize: 10,
    color: "#ffffff",
  },
  wordText: {
    ...Typography.heading.semiBold,
    fontSize: 36,
    color: "#FBAA12",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 44,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  forbiddenContainer: {
    alignItems: "center",
    width: "100%",
  },
  forbiddenTitle: {
    ...Typography.body.semiBold,
    fontSize: 14,
    color: "#ffffff",
    marginBottom: 8,
    opacity: 0.9,
  },
  forbiddenWords: {
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    width: "100%",
  },
  forbiddenWord: {
    ...Typography.body.regular,
    fontSize: 12,
    color: "#ffffff",
    opacity: 0.8,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    textAlign: "center",
    minWidth: 100,
  },

  // Action Buttons
  actionButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "rgba(26, 10, 43, 0.9)",
    borderWidth: 2,
    borderColor: "rgba(251, 170, 18, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  correctButton: {
    borderColor: "rgba(76, 175, 80, 0.5)",
  },
  passButton: {
    borderColor: "rgba(255, 152, 0, 0.5)",
  },
  skipButton: {
    borderColor: "rgba(244, 67, 54, 0.5)",
  },
  buttonIconContainer: {
    marginBottom: 8,
  },
  actionButtonText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.sm,
    color: "#ffffff",
    textAlign: "center",
  },

  // Game End Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  gameEndContainer: {
    backgroundColor: "#1a0a2b",
    borderRadius: 28,
    padding: Spacing.xl,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 2,
    borderColor: "#FBAA12",
  },
  gameEndHeader: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  gameEndTitle: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["2xl"],
    color: "#FBAA12",
    textAlign: "center",
    marginTop: Spacing.md,
  },
  winnerSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: "rgba(251, 170, 18, 0.1)",
    borderRadius: 16,
  },
  winnerText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["3xl"],
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  finalScoreText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.lg,
    color: "#ffffff",
    textAlign: "center",
    opacity: 0.8,
  },
  statsContainer: {
    marginBottom: Spacing.xl,
  },
  statsTitle: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.xl,
    color: "#FBAA12",
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  statLabel: {
    ...Typography.body.medium,
    fontSize: FontSizes.base,
    color: "#ffffff",
    opacity: 0.8,
  },
  statValue: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.lg,
    color: "#FBAA12",
  },
  gameEndButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  gameEndButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  playAgainButton: {
    backgroundColor: "#FBAA12",
  },
  menuButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FBAA12",
  },
  playAgainText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.base,
    color: "#2a0a3b",
  },
  menuText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.base,
    color: "#FBAA12",
  },
});