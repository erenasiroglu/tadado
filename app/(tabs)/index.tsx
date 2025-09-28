import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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
    router.push("/game-mode");
  };

  const handleBuyPress = (type: string) => {
    console.log(`Buy pressed: ${type}`);
    // TODO: Handle purchase
  };

  const cardTypes = ["travel", "adventure", "romance"];

  // NEW kartları belirle: tüm kartlar NEW (free olan dahil bazıları)
  const newCards = cardTypes;

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={["#25113e", "#32194e", "#25113f"]}
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
            isFree={type === "travel"}
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
