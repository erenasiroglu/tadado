import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLanguage } from "@/contexts/LanguageContext";

export default function TeamSetupScreen() {
  const { t } = useLanguage();

  // Team names
  const [alphaTeam, setAlphaTeam] = useState("Alpha Team");
  const [betaTeam, setBetaTeam] = useState("Beta Team");

  // Game settings
  const [language, setLanguage] = useState("tr");
  const [gameDuration, setGameDuration] = useState(30);
  const [rounds, setRounds] = useState(3);
  const [passLimit, setPassLimit] = useState(2);

  const handleStartGame = () => {
    if (!alphaTeam.trim() || !betaTeam.trim()) {
      Alert.alert(t("error"), t("teamNamesRequired"));
      return;
    }

    // Navigate to game screen
    router.push("/game");
  };

  const LanguageOption = ({
    value,
    label,
    isSelected,
    onPress,
  }: {
    value: string;
    label: string;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.optionButton, isSelected && styles.selectedOption]}
      onPress={onPress}
    >
      <Text
        style={[styles.optionText, isSelected && styles.selectedOptionText]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const NumberOption = ({
    value,
    label,
    isSelected,
    onPress,
  }: {
    value: number;
    label: string;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.optionButton, isSelected && styles.selectedOption]}
      onPress={onPress}
    >
      <Text
        style={[styles.optionText, isSelected && styles.selectedOptionText]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={["#25113e", "#32194e", "#25113f"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff5d4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("teamSetup")}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Team Names Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("teamNames")}</Text>

          <View style={styles.teamContainer}>
            <View style={styles.teamInputContainer}>
              <Text style={styles.teamLabel}>Alpha Team</Text>
              <TextInput
                style={styles.teamInput}
                value={alphaTeam}
                onChangeText={setAlphaTeam}
                placeholder={t("enterTeamName")}
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                maxLength={20}
              />
            </View>

            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>

            <View style={styles.teamInputContainer}>
              <Text style={styles.teamLabel}>Beta Team</Text>
              <TextInput
                style={styles.teamInput}
                value={betaTeam}
                onChangeText={setBetaTeam}
                placeholder={t("enterTeamName")}
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                maxLength={20}
              />
            </View>
          </View>
        </View>

        {/* Game Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("gameSettings")}</Text>

          {/* Language Selection */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>{t("language")}</Text>
            <View style={styles.optionsContainer}>
              <LanguageOption
                value="tr"
                label="Türkçe"
                isSelected={language === "tr"}
                onPress={() => setLanguage("tr")}
              />
              <LanguageOption
                value="en"
                label="English"
                isSelected={language === "en"}
                onPress={() => setLanguage("en")}
              />
            </View>
          </View>

          {/* Game Duration */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>
              {t("gameDuration")} (dakika)
            </Text>
            <View style={styles.optionsContainer}>
              <NumberOption
                value={15}
                label="15"
                isSelected={gameDuration === 15}
                onPress={() => setGameDuration(15)}
              />
              <NumberOption
                value={30}
                label="30"
                isSelected={gameDuration === 30}
                onPress={() => setGameDuration(30)}
              />
              <NumberOption
                value={45}
                label="45"
                isSelected={gameDuration === 45}
                onPress={() => setGameDuration(45)}
              />
              <NumberOption
                value={60}
                label="60"
                isSelected={gameDuration === 60}
                onPress={() => setGameDuration(60)}
              />
            </View>
          </View>

          {/* Rounds */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>{t("rounds")}</Text>
            <View style={styles.optionsContainer}>
              <NumberOption
                value={1}
                label="1"
                isSelected={rounds === 1}
                onPress={() => setRounds(1)}
              />
              <NumberOption
                value={3}
                label="3"
                isSelected={rounds === 3}
                onPress={() => setRounds(3)}
              />
              <NumberOption
                value={5}
                label="5"
                isSelected={rounds === 5}
                onPress={() => setRounds(5)}
              />
              <NumberOption
                value={7}
                label="7"
                isSelected={rounds === 7}
                onPress={() => setRounds(7)}
              />
            </View>
          </View>

          {/* Pass Limit */}
          <View style={styles.settingGroup}>
            <Text style={styles.settingLabel}>{t("passLimit")}</Text>
            <View style={styles.optionsContainer}>
              <NumberOption
                value={1}
                label="1"
                isSelected={passLimit === 1}
                onPress={() => setPassLimit(1)}
              />
              <NumberOption
                value={2}
                label="2"
                isSelected={passLimit === 2}
                onPress={() => setPassLimit(2)}
              />
              <NumberOption
                value={3}
                label="3"
                isSelected={passLimit === 3}
                onPress={() => setPassLimit(3)}
              />
              <NumberOption
                value={0}
                label={t("unlimited")}
                isSelected={passLimit === 0}
                onPress={() => setPassLimit(0)}
              />
            </View>
          </View>
        </View>

        {/* Start Game Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartGame}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>{t("startGame")}</Text>
          <Ionicons name="play" size={20} color="#2a0a3b" />
        </TouchableOpacity>
      </ScrollView>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 245, 212, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff5d4",
    marginBottom: 20,
  },
  teamContainer: {
    backgroundColor: "rgba(50, 25, 78, 0.9)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 245, 212, 0.2)",
  },
  teamInputContainer: {
    flex: 1,
  },
  teamLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff5d4",
    marginBottom: 8,
  },
  teamInput: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  vsContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  vsText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff5d4",
    backgroundColor: "rgba(255, 245, 212, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  settingGroup: {
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff5d4",
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 60,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#fff5d4",
    borderColor: "#fff5d4",
  },
  optionText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#25113e",
    fontWeight: "600",
  },
  startButton: {
    backgroundColor: "#fff5d4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: "#fff5d4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#25113e",
    marginRight: 8,
  },
});
