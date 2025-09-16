import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Player {
  id: string;
  name: string;
}

interface TeamSetupCardProps {
  teamNumber: number;
  teamName: string;
  players: Player[];
  onTeamNameChange: (teamNumber: number, newName: string) => void;
  onAddPlayer: (teamNumber: number) => void;
  onRemovePlayer: (teamNumber: number, playerId: string) => void;
  isEditable?: boolean;
}

export function TeamSetupCard({
  teamNumber,
  teamName,
  players,
  onTeamNameChange,
  onAddPlayer,
  onRemovePlayer,
  isEditable = true,
}: TeamSetupCardProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(teamName);

  const handleNameEdit = () => {
    if (!isEditable) return;
    setIsEditingName(true);
    setTempName(teamName);
  };

  const handleNameSave = () => {
    if (tempName.trim()) {
      onTeamNameChange(teamNumber, tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(teamName);
    setIsEditingName(false);
  };

  const handleAddPlayer = () => {
    if (!isEditable) return;
    Alert.prompt(
      "Add Player",
      "Enter player name",
      (playerName) => {
        if (playerName && playerName.trim()) {
          onAddPlayer(teamNumber);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* Team Header */}
      <View style={styles.header}>
        <View style={styles.teamIcon}>
          <Text style={styles.teamNumber}>{teamNumber}</Text>
        </View>
        
        <View style={styles.teamInfo}>
          {isEditingName ? (
            <TextInput
              style={styles.nameInput}
              value={tempName}
              onChangeText={setTempName}
              onSubmitEditing={handleNameSave}
              onBlur={handleNameSave}
              autoFocus
              placeholder="Enter team name"
              placeholderTextColor="#666"
            />
          ) : (
            <Text style={styles.teamName}>{teamName}</Text>
          )}
          <Text style={styles.playerCount}>
            {players.length} {players.length === 1 ? "Player" : "Players"}
          </Text>
        </View>

        <View style={styles.actions}>
          {isEditingName ? (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleNameSave}
              >
                <Ionicons name="checkmark" size={20} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleNameCancel}
              >
                <Ionicons name="close" size={20} color="#F44336" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleNameEdit}
              disabled={!isEditable}
            >
              <Ionicons 
                name="pencil" 
                size={20} 
                color={isEditable ? "#FBAA12" : "#666"} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Players List */}
      <View style={styles.playersContainer}>
        {players.map((player) => (
          <View key={player.id} style={styles.playerItem}>
            <Text style={styles.playerName}>{player.name}</Text>
            {isEditable && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemovePlayer(teamNumber, player.id)}
              >
                <Ionicons name="close-circle" size={20} color="#F44336" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        
        {isEditable && (
          <TouchableOpacity
            style={styles.addPlayerButton}
            onPress={handleAddPlayer}
          >
            <Ionicons name="add" size={20} color="#FBAA12" />
            <Text style={styles.addPlayerText}>Add Player</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a0a2b",
    borderRadius: 20,
    padding: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  teamIcon: {
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
  nameInput: {
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
  actions: {
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
});
