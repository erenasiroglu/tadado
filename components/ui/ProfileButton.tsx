import Colors from "@/constants/Colors";
import { FontSizes, Typography } from "@/constants/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileButtonProps {
  size?: number;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({ size = 40 }) => {
  const { user, session } = useAuth();
  const { t } = useLanguage();
  
  const handlePress = () => {
    if (session && user) {
      // Kullanıcı giriş yapmışsa profil sayfasına git
      router.push("/(tabs)/profile");
    } else {
      // Kullanıcı giriş yapmamışsa login sayfasına git
      router.push("/(auth)/login");
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
      onPress={handlePress}
    >
      {session && user ? (
        // Kullanıcı giriş yapmışsa, kullanıcı adının ilk harfini göster
        <Text style={styles.initial}>
          {user.username ? user.username.charAt(0).toUpperCase() : "U"}
        </Text>
      ) : (
        // Kullanıcı giriş yapmamışsa, kullanıcı simgesi göster
        <FontAwesome name="user" size={size / 2} color="#ffffff" />
      )}
      
      {/* Premium kullanıcı ise yıldız göster */}
      {session && user && user.is_premium && (
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumBadgeText}>⭐</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a0a2b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FBAA12",
  },
  initial: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
    color: "#FBAA12",
  },
  premiumBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: Colors.tadado.primary,
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  premiumBadgeText: {
    fontSize: 10,
  },
});
