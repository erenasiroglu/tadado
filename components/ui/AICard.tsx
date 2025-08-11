import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface AICardProps {
  onPress: () => void;
}

export const AICard: React.FC<AICardProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Only background remains, no text or icons */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 170,
    backgroundColor: "#1a0a2b",
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
