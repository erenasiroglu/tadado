import Colors from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
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

interface Team {
  id: string;
  name: string;
  players: string[];
}

export default function TeamSetupScreen() {
  const { t } = useLanguage();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "Team Alpha", players: ["Player 1", "Player 2"] },
    { id: "2", name: "Team Beta", players: ["Player 3", "Player 4"] },
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
      router.push(`/game/game-settings?category=${category}`);
    } else {
      Alert.alert(
        t("game.notEnoughPlayers"),
        t("game.minPlayersPerTeam")
      );
    }
  };

  return (
    <View style={styles.container}>
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
                      placeholder="Team name"
                      placeholderTextColor="#666"
                    />
                  ) : (
                    <Text style={styles.teamName}>{team.name}</Text>
                  )}
                  <Text style={styles.playerCount}>
                    {team.players.length} players
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => editingTeam === team.id ? handleTeamNameSave(team.id) : handleTeamNameEdit(team.id, team.name)}
                >
                  <Ionicons 
                    name={editingTeam === team.id ? "checkmark" : "pencil"} 
                    size={16} 
                    color={editingTeam === team.id ? "#4CAF50" : "#FBAA12"} 
                  />
                </TouchableOpacity>
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
                      <Ionicons name="close" size={14} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addPlayerButton}
                  onPress={() => addPlayerToTeam(team.id)}
                >
                  <Ionicons name="add" size={16} color="#FBAA12" />
                  <Text style={styles.addPlayerText}>Add Player</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tadado.primary,
    paddingTop: 44, // Status bar height
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  title: {
    ...Typography.heading.semiBold,
    fontSize: 18,
    color: "#FBAA12",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 32,
  },
  teamsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  teamCard: {
    backgroundColor: "#1a0a2b",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  teamHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  teamIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FBAA12",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  teamNumber: {
    ...Typography.heading.semiBold,
    fontSize: 16,
    color: "#2a0a3b",
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    ...Typography.heading.semiBold,
    fontSize: 16,
    color: "#FBAA12",
    marginBottom: 4,
  },
  teamNameInput: {
    ...Typography.heading.semiBold,
    fontSize: 16,
    color: "#FBAA12",
    backgroundColor: "#2a0a3b",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  playerCount: {
    ...Typography.body.medium,
    fontSize: 12,
    color: "#ffffff",
    opacity: 0.7,
  },
  editButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2a0a3b",
    alignItems: "center",
    justifyContent: "center",
  },
  playersContainer: {
    gap: 8,
  },
  playerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2a0a3b",
    borderRadius: 8,
    padding: 8,
  },
  playerName: {
    ...Typography.body.medium,
    fontSize: 14,
    color: "#ffffff",
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  addPlayerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a0a3b",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#FBAA12",
    borderStyle: "dashed",
    gap: 6,
  },
  addPlayerText: {
    ...Typography.body.medium,
    fontSize: 12,
    color: "#FBAA12",
  },
  startContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBAA12",
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: "#666",
  },
  startButtonText: {
    ...Typography.heading.semiBold,
    fontSize: 16,
    color: "#2a0a3b",
  },
});
