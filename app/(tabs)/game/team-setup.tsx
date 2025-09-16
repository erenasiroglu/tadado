import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import { useLanguage } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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

interface Team {
  id: string;
  name: string;
  players: string[];
}

export default function TeamSetupScreen() {
  const { t } = useLanguage();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: t("game.team1"), players: [] },
    { id: "2", name: t("game.team2"), players: [] },
  ]);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [tempTeamName, setTempTeamName] = useState("");

  const handleTeamNameEdit = (teamId: string, currentName: string) => {
    setEditingTeam(teamId);
    setTempTeamName(currentName);
  };

  const handleTeamNameSave = (teamId: string) => {
    if (tempTeamName.trim()) {
      setTeams((prev) =>
        prev.map((team) =>
          team.id === teamId ? { ...team, name: tempTeamName.trim() } : team
        )
      );
    }
    setEditingTeam(null);
    setTempTeamName("");
  };

  const handleTeamNameCancel = () => {
    setEditingTeam(null);
    setTempTeamName("");
  };

  const addPlayerToTeam = (teamId: string) => {
    Alert.prompt(
      t("game.addPlayer"),
      t("game.enterPlayerName"),
      (playerName) => {
        if (playerName && playerName.trim()) {
          setTeams((prev) =>
            prev.map((team) =>
              team.id === teamId
                ? { ...team, players: [...team.players, playerName.trim()] }
                : team
            )
          );
        }
      }
    );
  };

  const removePlayer = (teamId: string, playerIndex: number) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              players: team.players.filter((_, index) => index !== playerIndex),
            }
          : team
      )
    );
  };

  const canStartGame = () => {
    return teams.every((team) => team.players.length >= 2);
  };

  const handleStartGame = () => {
    if (canStartGame()) {
      router.push(`/(tabs)/game/game-settings?category=${category}`);
    } else {
      Alert.alert(
        t("game.notEnoughPlayers"),
        t("game.minPlayersPerTeam")
      );
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
          <Text style={styles.title}>{t("game.setupTeams")}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Teams */}
        <View style={styles.teamsContainer}>
          {teams.map((team, index) => (
            <View key={team.id} style={styles.teamCard}>
              <View style={styles.teamHeader}>
                <View style={styles.teamIconContainer}>
                  <Text style={styles.teamNumber}>{index + 1}</Text>
                </View>
                <View style={styles.teamInfo}>
                  {editingTeam === team.id ? (
                    <TextInput
                      style={styles.teamNameInput}
                      value={tempTeamName}
                      onChangeText={setTempTeamName}
                      onSubmitEditing={() => handleTeamNameSave(team.id)}
                      autoFocus
                      placeholder={t("game.enterTeamName")}
                      placeholderTextColor="#666"
                    />
                  ) : (
                    <Text style={styles.teamName}>{team.name}</Text>
                  )}
                  <Text style={styles.playerCount}>
                    {team.players.length} {t("game.players")}
                  </Text>
                </View>
                <View style={styles.teamActions}>
                  {editingTeam === team.id ? (
                    <View style={styles.editActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleTeamNameSave(team.id)}
                      >
                        <Ionicons name="checkmark" size={20} color="#4CAF50" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleTeamNameCancel}
                      >
                        <Ionicons name="close" size={20} color="#F44336" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleTeamNameEdit(team.id, team.name)}
                    >
                      <Ionicons name="pencil" size={20} color="#FBAA12" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Players List */}
              <View style={styles.playersContainer}>
                {team.players.map((player, playerIndex) => (
                  <View key={playerIndex} style={styles.playerItem}>
                    <Text style={styles.playerName}>{player}</Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removePlayer(team.id, playerIndex)}
                    >
                      <Ionicons name="close-circle" size={20} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addPlayerButton}
                  onPress={() => addPlayerToTeam(team.id)}
                >
                  <Ionicons name="add" size={20} color="#FBAA12" />
                  <Text style={styles.addPlayerText}>{t("game.addPlayer")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Start Game Button */}
        <View style={styles.startContainer}>
          <TouchableOpacity
            style={[
              styles.startButton,
              !canStartGame() && styles.disabledButton,
            ]}
            onPress={handleStartGame}
            disabled={!canStartGame()}
          >
            <Text style={styles.startButtonText}>{t("game.continueToSettings")}</Text>
            <Ionicons name="arrow-forward" size={24} color="#2a0a3b" />
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
  teamsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  teamCard: {
    backgroundColor: "#1a0a2b",
    borderRadius: 20,
    padding: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  teamHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  teamIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FBAA12",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  teamNumber: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
    color: "#2a0a3b",
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
    color: "#FBAA12",
    marginBottom: Spacing.xs,
  },
  teamNameInput: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
    color: "#FBAA12",
    backgroundColor: "#2a0a3b",
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  playerCount: {
    ...Typography.body.medium,
    fontSize: FontSizes.sm,
    color: "#ffffff",
    opacity: 0.7,
  },
  teamActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2a0a3b",
    alignItems: "center",
    justifyContent: "center",
  },
  playersContainer: {
    gap: Spacing.sm,
  },
  playerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2a0a3b",
    borderRadius: 12,
    padding: Spacing.sm,
  },
  playerName: {
    ...Typography.body.medium,
    fontSize: FontSizes.base,
    color: "#ffffff",
    flex: 1,
  },
  removeButton: {
    padding: Spacing.xs,
  },
  addPlayerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a0a3b",
    borderRadius: 12,
    padding: Spacing.sm,
    borderWidth: 2,
    borderColor: "#FBAA12",
    borderStyle: "dashed",
    gap: Spacing.xs,
  },
  addPlayerText: {
    ...Typography.body.medium,
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
  disabledButton: {
    backgroundColor: "#666",
  },
  startButtonText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
    color: "#2a0a3b",
  },
});
