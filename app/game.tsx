import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLanguage } from "@/contexts/LanguageContext";
import adventureData from "@/data/adventure.json";
import romanceData from "@/data/romance.json";
import travelData from "@/data/travel.json";

interface GameCard {
  id: string;
  mainWord: string;
  difficulty: string;
  forbiddenWords: string[];
  hints: string[];
  tags: string[];
}

interface GameState {
  currentRound: number;
  totalRounds: number;
  timeLeft: number;
  gameDuration: number;
  currentTeam: "alpha" | "beta";
  alphaScore: number;
  betaScore: number;
  currentCard: GameCard | null;
  cardsGuessed: number;
  passCount: number;
  passLimit: number;
  gamePhase: "preparing" | "playing" | "roundEnd" | "gameEnd";
  category: string;
}

export default function GameScreen() {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 1,
    totalRounds: 3,
    timeLeft: 30,
    gameDuration: 30,
    currentTeam: "alpha",
    alphaScore: 0,
    betaScore: 0,
    currentCard: null,
    cardsGuessed: 0,
    passCount: 0,
    passLimit: 2,
    gamePhase: "preparing",
    category: "romance",
  });

  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const [pulseAnim] = useState(new Animated.Value(1));

  // Get cards for current category
  const getCardsForCategory = (category: string): GameCard[] => {
    switch (category) {
      case "romance":
        return romanceData.cards;
      case "adventure":
        return adventureData.cards;
      case "travel":
        return travelData.cards;
      default:
        return romanceData.cards;
    }
  };

  const handleCorrectGuess = () => {
    // Pulse animation for correct guess
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

    setGameState((prev) => ({
      ...prev,
      cardsGuessed: prev.cardsGuessed + 1,
      [prev.currentTeam === "alpha" ? "alphaScore" : "betaScore"]:
        prev[prev.currentTeam === "alpha" ? "alphaScore" : "betaScore"] + 1,
    }));

    // Get next card
    setTimeout(() => {
      const cards = getCardsForCategory(gameState.category);
      const randomCard = cards[Math.floor(Math.random() * cards.length)];

      setGameState((prev) => ({
        ...prev,
        currentCard: randomCard,
      }));
    }, 200);
  };

  const handlePass = () => {
    if (gameState.passCount >= gameState.passLimit) return;

    setGameState((prev) => ({
      ...prev,
      passCount: prev.passCount + 1,
    }));

    // Get next card
    const cards = getCardsForCategory(gameState.category);
    const randomCard = cards[Math.floor(Math.random() * cards.length)];

    setGameState((prev) => ({
      ...prev,
      currentCard: randomCard,
    }));
  };

  const handleTadado = () => {
    Alert.alert(t("tadado"), t("forbiddenWordUsed"), [
      {
        text: t("ok"),
        onPress: () => {
          setGameState((prev) => ({
            ...prev,
            currentTeam: prev.currentTeam === "alpha" ? "beta" : "alpha",
            passCount: 0,
          }));
        },
      },
    ]);
  };

  const nextRound = () => {
    if (gameState.currentRound >= gameState.totalRounds) {
      setGameState((prev) => ({
        ...prev,
        gamePhase: "gameEnd",
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        currentTeam: prev.currentTeam === "alpha" ? "beta" : "alpha",
        timeLeft: prev.gameDuration,
        cardsGuessed: 0,
        passCount: 0,
        gamePhase: "preparing",
      }));
    }
  };

  const formatTime = (seconds: number) => {
    return seconds.toString();
  };

  const getTeamName = (team: "alpha" | "beta") => {
    return team === "alpha" ? "Alpha Team" : "Beta Team";
  };

  useEffect(() => {
    const cards = getCardsForCategory(gameState.category);
    const randomCard = cards[Math.floor(Math.random() * cards.length)];

    setGameState((prev) => ({
      ...prev,
      currentCard: randomCard,
      gamePhase: "playing",
      timeLeft: prev.gameDuration,
    }));

    // Start timer
    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          return {
            ...prev,
            gamePhase: "roundEnd",
            timeLeft: 0,
          };
        }
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1,
        };
      });
    }, 1000);

    // Animate card entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    return () => clearInterval(timer);
  }, [fadeAnim, scaleAnim, gameState.category]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Tadado Background Gradient */}
      <LinearGradient
        colors={["#25113e", "#32194e", "#25113f"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="home-outline" size={24} color="#fff5d4" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.roundText}>{gameState.currentRound}. TUR</Text>
          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>
              {formatTime(gameState.timeLeft)}
            </Text>
          </View>
        </View>

        <View style={styles.placeholder} />
      </View>

      {/* Game Card */}
      {gameState.currentCard && gameState.gamePhase === "playing" && (
        <Animated.View
          style={[
            styles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.gameCard}>
            {/* Main Word Header - Tadado Style */}
            <Animated.View
              style={[
                styles.mainWordHeader,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={styles.mainWordText}>
                {gameState.currentCard.mainWord.toUpperCase()}
              </Text>
            </Animated.View>

            {/* Forbidden Words - Clean List */}
            <View style={styles.forbiddenWordsContainer}>
              {gameState.currentCard.forbiddenWords.map((word, index) => (
                <View key={index} style={styles.forbiddenWordItem}>
                  <Text style={styles.forbiddenWordText}>{word}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      )}

      {/* Game Controls - Tadado Style */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.passButton,
            gameState.passCount >= gameState.passLimit && styles.disabledButton,
          ]}
          onPress={handlePass}
          disabled={gameState.passCount >= gameState.passLimit}
        >
          <Ionicons name="arrow-forward" size={24} color="#FF8C42" />
          {gameState.passCount > 0 && (
            <View style={styles.passCountBadge}>
              <Text style={styles.passCountText}>{gameState.passCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.tadadoButton]}
          onPress={handleTadado}
        >
          <View style={styles.tadadoIconContainer}>
            <Image
              source={require("@/assets/images/tadado_icon.png")}
              style={styles.tadadoIcon}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.correctButton]}
          onPress={handleCorrectGuess}
        >
          <Ionicons name="checkmark" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Round End Modal */}
      {gameState.gamePhase === "roundEnd" && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTadadoIcon}>
                <Text style={styles.tadadoIconText}>T</Text>
              </View>
              <Text style={styles.modalTitle}>{t("roundEnd")}</Text>
            </View>
            <Text style={styles.modalSubtitle}>
              {getTeamName(gameState.currentTeam)} - {t("cardsGuessed")}:{" "}
              {gameState.cardsGuessed}
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={nextRound}>
              <Text style={styles.modalButtonText}>
                {gameState.currentRound >= gameState.totalRounds
                  ? t("finishGame")
                  : t("nextRound")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  homeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  roundText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff5d4",
  },
  timerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff5d4",
    borderWidth: 2,
    borderColor: "#fff5d4",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#25113e",
  },
  placeholder: {
    width: 40,
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  gameCard: {
    backgroundColor: "#fff5d4",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  mainWordHeader: {
    backgroundColor: "#6A4C93",
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  mainWordText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff5d4",
    letterSpacing: 2,
    textAlign: "center",
  },
  forbiddenWordsContainer: {
    padding: 24,
    gap: 12,
  },
  forbiddenWordItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  forbiddenWordText: {
    fontSize: 16,
    color: "#25113e",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 22,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 40,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  passButton: {
    backgroundColor: "#fff5d4",
    borderWidth: 2,
    borderColor: "rgba(255, 245, 212, 0.3)",
  },
  tadadoButton: {
    borderWidth: 3,
    borderColor: "#fff5d4",
  },
  correctButton: {
    backgroundColor: "#fff5d4",
    borderWidth: 2,
    borderColor: "rgba(255, 245, 212, 0.3)",
  },
  disabledButton: {
    opacity: 0.5,
  },
  tadadoIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  tadadoIcon: {
    width: 50,
    height: 50,
  },
  passCountBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF8C42",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff5d4",
  },
  passCountText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff5d4",
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 245, 212, 0.3)",
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalTadadoIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6A4C93",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  tadadoIconText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff5d4",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#25113e",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#6A4C93",
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "500",
  },
  modalButton: {
    backgroundColor: "#6A4C93",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#6A4C93",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff5d4",
  },
});
