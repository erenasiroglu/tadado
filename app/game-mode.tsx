import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLanguage } from "@/contexts/LanguageContext";

export default function GameModeScreen() {
  const { t } = useLanguage();

  const handleTeamModePress = () => {
    router.push("/team-setup");
  };

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
        <Text style={styles.headerTitle}>{t("selectGameMode")}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Game Mode Card */}
        <View style={styles.gameModeCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="people" size={48} color="#fff5d4" />
          </View>

          <Text style={styles.gameModeTitle}>{t("teamMode")}</Text>
          <Text style={styles.gameModeDescription}>
            {t("teamModeDescription")}
          </Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#fff5d4" />
              <Text style={styles.featureText}>{t("twoTeams")}</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#fff5d4" />
              <Text style={styles.featureText}>{t("fourPlusPlayers")}</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#fff5d4" />
              <Text style={styles.featureText}>{t("classicGameplay")}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleTeamModePress}
            activeOpacity={0.8}
          >
            <Text style={styles.selectButtonText}>{t("selectMode")}</Text>
            <Ionicons name="arrow-forward" size={20} color="#25113e" />
          </TouchableOpacity>
        </View>

        {/* Coming Soon Cards */}
        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonTitle}>{t("comingSoon")}</Text>

          <View style={styles.comingSoonCard}>
            <View style={styles.disabledIconContainer}>
              <Ionicons
                name="person"
                size={32}
                color="rgba(251, 170, 18, 0.3)"
              />
            </View>
            <Text style={styles.comingSoonText}>{t("soloMode")}</Text>
          </View>

          <View style={styles.comingSoonCard}>
            <View style={styles.disabledIconContainer}>
              <Ionicons
                name="globe"
                size={32}
                color="rgba(251, 170, 18, 0.3)"
              />
            </View>
            <Text style={styles.comingSoonText}>{t("onlineMode")}</Text>
          </View>
        </View>
      </View>
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
    paddingTop: 20,
  },
  gameModeCard: {
    backgroundColor: "rgba(50, 25, 78, 0.9)",
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(255, 245, 212, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 245, 212, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  gameModeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff5d4",
    textAlign: "center",
    marginBottom: 12,
  },
  gameModeDescription: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 24,
    marginBottom: 24,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 12,
    opacity: 0.9,
  },
  selectButton: {
    backgroundColor: "#fff5d4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: "#fff5d4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  selectButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#25113e",
    marginRight: 8,
  },
  comingSoonContainer: {
    marginTop: 20,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
    opacity: 0.7,
  },
  comingSoonCard: {
    backgroundColor: "rgba(26, 10, 43, 0.5)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    opacity: 0.6,
  },
  disabledIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(251, 170, 18, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  comingSoonText: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.5,
  },
});
