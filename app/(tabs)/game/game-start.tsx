import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
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
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function GameStartScreen() {
  const { t } = useLanguage();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const slideAnim = new Animated.Value(50);

  const steps = [
    {
      title: t("game.prepareDevice"),
      description: t("game.prepareDeviceDescription"),
      icon: "phone-portrait-outline",
      color: "#FBAA12",
    },
    {
      title: t("game.giveToNarrator"),
      description: t("game.giveToNarratorDescription"),
      icon: "person-outline",
      color: "#4CAF50",
    },
    {
      title: t("game.readyToStart"),
      description: t("game.readyToStartDescription"),
      icon: "checkmark-circle-outline",
      color: "#2196F3",
    },
  ];

  useEffect(() => {
    animateIn();
  }, [currentStep]);

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      slideAnim.setValue(50);
      setCurrentStep(currentStep + 1);
    } else {
      setIsReady(true);
    }
  };

  const handleStartGame = () => {
    router.push(`/(tabs)/game/playing?category=${category}`);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      slideAnim.setValue(50);
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index <= currentStep && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        {/* Step Content */}
        <Animated.View
          style={[
            styles.stepContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <View
              style={[
                styles.iconBackground,
                { backgroundColor: currentStepData.color },
              ]}
            >
              <Ionicons
                name={currentStepData.icon as any}
                size={60}
                color="#ffffff"
              />
            </View>
          </View>

          <Text style={styles.stepTitle}>{currentStepData.title}</Text>
          <Text style={styles.stepDescription}>
            {currentStepData.description}
          </Text>

          {/* Additional Info for specific steps */}
          {currentStep === 0 && (
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color="#FBAA12" />
              <Text style={styles.infoText}>
                {t("game.deviceInfo")}
              </Text>
            </View>
          )}

          {currentStep === 1 && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>{t("game.narratorTips")}</Text>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>{t("game.tip1")}</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>{t("game.tip2")}</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>{t("game.tip3")}</Text>
              </View>
            </View>
          )}

          {currentStep === 2 && (
            <View style={styles.readyContainer}>
              <View style={styles.readyIcon}>
                <Ionicons name="rocket" size={40} color="#FBAA12" />
              </View>
              <Text style={styles.readyText}>{t("game.readyToPlay")}</Text>
            </View>
          )}
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {currentStep < steps.length - 1 ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
              >
                <Ionicons name="arrow-back" size={20} color="#FBAA12" />
                <Text style={styles.backButtonText}>{t("common.back")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
              >
                <Text style={styles.nextButtonText}>{t("common.next")}</Text>
                <Ionicons name="arrow-forward" size={20} color="#2a0a3b" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.startGameButton}
              onPress={handleStartGame}
            >
              <Ionicons name="play" size={24} color="#2a0a3b" />
              <Text style={styles.startGameButtonText}>
                {t("game.startPlaying")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tadado.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: "space-between",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#333",
  },
  progressDotActive: {
    backgroundColor: "#FBAA12",
  },
  stepContainer: {
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
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  stepTitle: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["2xl"],
    color: "#FBAA12",
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  stepDescription: {
    ...Typography.body.regular,
    fontSize: FontSizes.lg,
    color: "#ffffff",
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a0a3b",
    borderRadius: 16,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  infoText: {
    ...Typography.body.regular,
    fontSize: FontSizes.sm,
    color: "#ffffff",
    opacity: 0.8,
    flex: 1,
    lineHeight: 18,
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
  readyContainer: {
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  readyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2a0a3b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  readyText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.xl,
    color: "#4CAF50",
    textAlign: "center",
  },
  buttonContainer: {
    paddingVertical: Spacing.xl,
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  backButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a0a3b",
    borderRadius: 24,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  backButtonText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.base,
    color: "#FBAA12",
  },
  nextButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBAA12",
    borderRadius: 24,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  nextButtonText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
    color: "#2a0a3b",
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
