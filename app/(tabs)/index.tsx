import { AICard } from "@/components/ui/AICard";
import { GameCard } from "@/components/ui/GameCard";
import { HorizontalCardScroll } from "@/components/ui/HorizontalCardScroll";
import { ProfileButton } from "@/components/ui/ProfileButton";
import Colors from "@/constants/Colors";
import { FontSizes, Typography } from "@/constants/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { router } from "expo-router";
import React from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user, session, loading, signOut, updateUserProfile } = useAuth();
  const { t } = useLanguage();

  const handleSignOut = async () => {
    Alert.alert(t("auth.signOut"), t("auth.signOutConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("auth.signOut"),
        style: "destructive",
        onPress: signOut,
      },
    ]);
  };

  const handleTogglePremium = async () => {
    if (!user) return;

    const result = await updateUserProfile({
      is_premium: !user.is_premium,
    });

    if (result.success) {
      Alert.alert(t("common.success"), t("home.premiumUpdated"));
    } else {
      Alert.alert(t("common.error"), result.error || t("home.updateFailed"));
    }
  };

  const handleAICardPress = () => {
    // Navigate to Ask page for now
    router.push("/(tabs)/ask");
  };

  const handleGameCardPress = (type: string) => {
    // Navigate to game mode selection with category
    router.push(`/game?category=${type}`);
  };

  const handlePreviewPress = (type: string) => {
    Alert.alert(`${type}`, t("games.preview", { type }));
  };

  const handleCardPress = (index: number) => {
    // Map index to category type
    const categories = ['romance', 'travel', 'adventure', 'party'];
    const category = categories[index];
    if (category) {
      handleGameCardPress(category);
    }
  };

  const handleBuyPress = (index: number) => {
    Alert.alert(
      t("cards.buyPressed"),
      t("cards.buyingCard", { number: (index + 1).toString() })
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>{t("common.loading")}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("@/assets/images/tado.svg")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>{t("common.welcome")}</Text>
        </View>
        <View style={styles.headerRight}>
          <ProfileButton size={36} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        bounces={true}
        alwaysBounceVertical={true}
      >
        <View style={styles.content}>
          {/* Horizontal Card Scroll */}
          <HorizontalCardScroll
            onCardPress={handleCardPress}
            onBuyPress={handleBuyPress}
          />

          {/* AI Card */}
          <AICard onPress={handleAICardPress} />

          {/* Game Cards Row */}
          <View style={styles.gameCardsContainer}>
            <GameCard
              type="classic"
              onPress={() => handleGameCardPress(t("games.classicFun"))}
              onPreview={() => handlePreviewPress(t("games.classicFun"))}
            />
            <GameCard
              type="dirty"
              onPress={() => handleGameCardPress(t("games.dirtyMinds"))}
              onPreview={() => handlePreviewPress(t("games.dirtyMinds"))}
            />
            <GameCard
              type="custom"
              onPress={() => handleGameCardPress(t("games.yourOwnStyle"))}
              onPreview={() => handlePreviewPress(t("games.yourOwnStyle"))}
            />
          </View>

          {/* User Profile Section (if authenticated) */}
          {session && user && (
            <View style={styles.userSection}>
              <Text style={styles.userSectionTitle}>
                {t("home.yourProfile")}
              </Text>
              <View style={styles.userCard}>
                <Text style={styles.username}>@{user.username}</Text>
                <Text style={styles.userEmail}>{session.user.email}</Text>

                <View style={styles.userStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>{t("common.language")}</Text>
                    <Text style={styles.statValue}>{user.language}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>{t("common.premium")}</Text>
                    <Text
                      style={[
                        styles.statValue,
                        user.is_premium && styles.premiumText,
                      ]}
                    >
                      {user.is_premium ? t("home.premium") : t("home.standard")}
                    </Text>
                  </View>
                </View>

                <View style={styles.userActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleTogglePremium}
                  >
                    <Text style={styles.actionButtonText}>
                      {user.is_premium
                        ? t("home.cancelPremium")
                        : t("home.goPremium")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.signOutButton]}
                    onPress={handleSignOut}
                  >
                    <Text style={styles.signOutText}>
                      {t("common.signOut")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tadado.primary,
    paddingBottom: 0, // Tab bar için alt padding kaldırıldı
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: Colors.tadado.primary,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 36,
    height: 36,
    marginRight: 8,
  },
  headerTitle: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.xl,
    color: "#FFF0CF",
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 180, // Çok daha fazla boşluk ilk yükleme için
    minHeight: "100%", // Minimum yükseklik garantisi
    justifyContent: "flex-start", // İçeriği üstten başlat
  },
  content: {
    paddingHorizontal: 8, // Sadece yatay padding
    paddingTop: 8,
    paddingBottom: 0, // Alt padding kaldırıldı
  },
  gameCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 80, // Tab bar için çok daha fazla boşluk
    paddingBottom: 40, // Ekstra padding daha da artırıldı
    paddingHorizontal: 8, // Ana content ile aynı hizada
    gap: 8, // Kartlar arası boşluk
  },
  languageContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.xl,
    color: "#FBAA12",
    marginBottom: 12,
  },
  userSection: {
    marginTop: 32,
  },
  userSectionTitle: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["2xl"],
    color: "#FBAA12",
    marginBottom: 16,
  },
  userCard: {
    backgroundColor: "#1a0a2b",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  username: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.lg,
    color: "#FBAA12",
    marginBottom: 4,
  },
  userEmail: {
    ...Typography.body.regular,
    fontSize: FontSizes.base,
    color: "#ffffff",
    opacity: 0.8,
    marginBottom: 16,
  },
  userStats: {
    marginBottom: 24,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#2a0a3b",
  },
  statLabel: {
    ...Typography.body.medium,
    fontSize: FontSizes.base,
    color: "#ffffff",
    opacity: 0.7,
  },
  statValue: {
    ...Typography.body.medium,
    fontSize: FontSizes.base,
    color: "#ffffff",
  },
  premiumText: {
    color: "#FBAA12",
  },
  userActions: {
    gap: 8,
  },
  actionButton: {
    backgroundColor: "#FBAA12",
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
  },
  actionButtonText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.base,
    color: "#2a0a3b",
  },
  signOutButton: {
    backgroundColor: "#D92151",
  },
  signOutText: {
    color: "#ffffff",
  },
  loadingText: {
    ...Typography.body.regular,
    fontSize: FontSizes.lg,
    color: "#FBAA12",
    textAlign: "center",
    marginTop: 50,
  },
});
