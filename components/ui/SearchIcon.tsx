import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

interface SearchIconProps {
  size?: number;
  color?: string;
  onPress?: () => void;
}

export const SearchIcon: React.FC<SearchIconProps> = ({
  size = 24,
  color = "#FFF0CF",
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={{ padding: 8 }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="search-outline" size={size} color={color} />
    </TouchableOpacity>
  );
};
