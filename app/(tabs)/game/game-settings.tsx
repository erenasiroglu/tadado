import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import { useGame } from "@/contexts/GameContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GameSettings {
  deckLanguage: string;
  roundDuration: number;
  totalRounds: number;
  passLimit: number;
  allowPass: boolean;
}

export default function GameSettingsScreen() {
  const { t } = useLanguage();
  const { category } = useLocalSearchParams<{ category: string }>();
  const { createGameSession } = useGame();
  const [settings, setSettings] = useState<GameSettings>({
    deckLanguage: "en",
    roundDuration: 60,
    totalRounds: 5,
    passLimit: 3,
    allowPass: true,
  });

  const languages = [
    { code: "en", name: t("languages.en"), flag: "🇺🇸" },
    { code: "tr", name: t("languages.tr"), flag: "🇹🇷" },
    { code: "de", name: t("languages.de"), flag: "🇩🇪" },
  ];

  const durationOptions = [
    { value: 30, label: "30" },
    { value: 60, label: "60" },
    { value: 90, label: "90" },
    { value: 120, label: "120" },
  ];

  const roundOptions = [
    { value: 3, label: "3" },
    { value: 5, label: "5" },
    { value: 7, label: "7" },
    { value: 10, label: "10" },
  ];

  const passLimitOptions = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
  ];

  const updateSetting = <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleStartGame = async () => {
    try {
      // Create teams (we'll get these from team-setup screen later)
      const teams = [
        { id: "1", name: t("game.team1"), players: ["Player 1", "Player 2"], score: 0 },
        { id: "2", name: t("game.team2"), players: ["Player 3", "Player 4"], score: 0 },
      ];

      // Create game session
      const result = await createGameSession(settings, teams);
      
      if (result.success) {
        // Navigate to game start screen with category
        router.push(`/(tabs)/game/game-start?category=${category}`);
      } else {
        Alert.alert(t("common.error"), result.error || t("game.createSessionFailed"));
      }
    } catch (error) {
      console.error('Error creating game session:', error);
      Alert.alert(t("common.error"), t("game.createSessionFailed"));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FBAA12" />
          </TouchableOpacity>
          <Text style={styles.title}>{t("game.gameSettings")}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.settingsContainer}>
          {/* Deck Language */}
          <View style={styles.settingSection}>
            <Text style={styles.sectionTitle}>{t("game.deckLanguage")}</Text>
            <View style={styles.languageOptions}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    settings.deckLanguage === lang.code && styles.selectedOption,
                  ]}
                  onPress={() => updateSetting("deckLanguage", lang.code)}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text
                    style={[
                      styles.languageName,
                      settings.deckLanguage === lang.code && styles.selectedText,
                    ]}
                  >
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Round Duration */}
          <View style={styles.settingSection}>
            <Text style={styles.sectionTitle}>{t("game.roundDuration")}</Text>
            <Text style={styles.sectionSubtitle}>
              {t("game.roundDurationSubtitle")}
            </Text>
            <View style={styles.optionsContainer}>
              {durationOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    settings.roundDuration === option.value && styles.selectedOption,
                  ]}
                  onPress={() => updateSetting("roundDuration", option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      settings.roundDuration === option.value && styles.selectedText,
                    ]}
                  >
                    {option.label}s
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Total Rounds */}
          <View style={styles.settingSection}>
            <Text style={styles.sectionTitle}>{t("game.totalRounds")}</Text>
            <Text style={styles.sectionSubtitle}>
              {t("game.totalRoundsSubtitle")}
            </Text>
            <View style={styles.optionsContainer}>
              {roundOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    settings.totalRounds === option.value && styles.selectedOption,
                  ]}
                  onPress={() => updateSetting("totalRounds", option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      settings.totalRounds === option.value && styles.selectedText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Pass Settings */}
          <View style={styles.settingSection}>
            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={styles.sectionTitle}>{t("game.allowPass")}</Text>
                <Text style={styles.sectionSubtitle}>
                  {t("game.allowPassSubtitle")}
                </Text>
              </View>
              <Switch
                value={settings.allowPass}
                onValueChange={(value) => updateSetting("allowPass", value)}
                trackColor={{ false: "#666", true: "#FBAA12" }}
                thumbColor={settings.allowPass ? "#2a0a3b" : "#f4f3f4"}
              />
            </View>

            {settings.allowPass && (
              <View style={styles.passLimitContainer}>
                <Text style={styles.passLimitTitle}>
                  {t("game.passLimit")}
                </Text>
                <View style={styles.optionsContainer}>
                  {passLimitOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        settings.passLimit === option.value && styles.selectedOption,
                      ]}
                      onPress={() => updateSetting("passLimit", option.value)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          settings.passLimit === option.value && styles.selectedText,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Game Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{t("game.gameSummary")}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t("game.deckLanguage")}:</Text>
              <Text style={styles.summaryValue}>
                {languages.find((l) => l.code === settings.deckLanguage)?.name}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t("game.roundDuration")}:</Text>
              <Text style={styles.summaryValue}>{settings.roundDuration}s</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t("game.totalRounds")}:</Text>
              <Text style={styles.summaryValue}>{settings.totalRounds}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t("game.passLimit")}:</Text>
              <Text style={styles.summaryValue}>
                {settings.allowPass ? settings.passLimit : t("game.noPass")}
              </Text>
            </View>
          </View>
        </View>

        {/* Start Game Button */}
        <View style={styles.startContainer}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
            <Text style={styles.startButtonText}>{t("game.startGame")}</Text>
            <Ionicons name="play" size={24} color="#2a0a3b" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tadado.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
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
  settingsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  settingSection: {
    backgroundColor: "#1a0a2b",
    borderRadius: 20,
    padding: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sectionTitle: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
    color: "#FBAA12",
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    ...Typography.body.regular,
    fontSize: FontSizes.sm,
    color: "#ffffff",
    opacity: 0.7,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  languageOptions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  languageOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a0a3b",
    borderRadius: 12,
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  selectedOption: {
    backgroundColor: "#FBAA12",
  },
  languageFlag: {
    fontSize: 20,
  },
  languageName: {
    ...Typography.body.medium,
    fontSize: FontSizes.sm,
    color: "#ffffff",
  },
  selectedText: {
    color: "#2a0a3b",
  },
  optionsContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  optionButton: {
    flex: 1,
    backgroundColor: "#2a0a3b",
    borderRadius: 12,
    padding: Spacing.sm,
    alignItems: "center",
  },
  optionText: {
    ...Typography.body.medium,
    fontSize: FontSizes.base,
    color: "#ffffff",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchInfo: {
    flex: 1,
  },
  passLimitContainer: {
    marginTop: Spacing.md,
  },
  passLimitTitle: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.base,
    color: "#FBAA12",
    marginBottom: Spacing.sm,
  },
  summaryCard: {
    backgroundColor: "#2a0a3b",
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: "#FBAA12",
  },
  summaryTitle: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
    color: "#FBAA12",
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.body.medium,
    fontSize: FontSizes.base,
    color: "#ffffff",
    opacity: 0.8,
  },
  summaryValue: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.base,
    color: "#FBAA12",
  },
  startContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBAA12",
    borderRadius: 24,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  startButtonText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
    color: "#2a0a3b",
  },
});
