import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/ui/Card";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HomeScreen() {
  const { t } = useLanguage();

  const handleCardPress = (type: string) => {
    console.log(`Card pressed: ${type}`);
    // TODO: Navigate to game or show details
  };

  const handleBuyPress = (type: string) => {
    console.log(`Buy pressed: ${type}`);
    // TODO: Handle purchase
  };

  const cardTypes = [
    "romance",
    "travel",
    "adventure",
    "party",
    "dirtyMinds",
    "celebrities",
  ];

  // NEW kartları belirle: tüm kartlar NEW (free olan dahil bazıları)
  const newCards = cardTypes;

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={["#150527", "#1a0a2b", "#150527"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header with Profile Button */}
      <View style={styles.header}>
        <ProfileButton size={40} />
      </View>

      {/* Cards Section */}
      <ScrollView
        horizontal
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
      >
        {cardTypes.map((type) => (
          <Card
            key={type}
            title={t(type)}
            description={t(`${type}Description`)}
            type={type}
            onPress={() => handleCardPress(type)}
            onBuy={() => handleBuyPress(type)}
            isNew={newCards.includes(type)}
            isFree={type === cardTypes[0]}
          />
        ))}
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
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  scrollView: {
    flex: 1,
    paddingTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    alignItems: "flex-start",
  },
});
