import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, session, loading, signOut, updateUserProfile } = useAuth();
  const { t, locale, setLocale, locales } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [selectedLanguage, setSelectedLanguage] = useState(user?.language || locale);
  const [updatingProfile, setUpdatingProfile] = useState(false);

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

  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setUpdatingProfile(true);
    
    try {
      // Update language in context
      if (selectedLanguage !== locale) {
        await setLocale(selectedLanguage as any);
      }
      
      // Update user profile in database
      const result = await updateUserProfile({
        username: username !== user.username ? username : undefined,
        language: selectedLanguage !== user.language ? selectedLanguage : undefined,
      });

      if (result.success) {
        Alert.alert(t("common.success"), t("profile.updateSuccess"));
        setIsEditing(false);
      } else {
        Alert.alert(t("common.error"), result.error || t("profile.updateFailed"));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(t("common.error"), t("profile.updateFailed"));
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setUsername(user?.username || "");
    setSelectedLanguage(user?.language || locale);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FBAA12" />
          <Text style={styles.loadingText}>{t("common.loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!session || !user) {
    // Redirect to login if not authenticated
    router.replace("/(auth)/login");
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient
        colors={[Colors.tadado.primary, "#2a0a3b"]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FBAA12" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("profile.title")}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            disabled={updatingProfile}
          >
            {updatingProfile ? (
              <ActivityIndicator size="small" color="#FBAA12" />
            ) : (
              <Text style={styles.editButtonText}>
                {isEditing ? t("common.save") : t("common.edit")}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {user.avatar_url ? (
                <Image
                  source={{ uri: user.avatar_url }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>
                    {user.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              {user.is_premium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>⭐</Text>
                </View>
              )}
            </View>
            
            {isEditing ? (
              <TextInput
                style={styles.usernameInput}
                value={username}
                onChangeText={setUsername}
                placeholder={t("profile.usernamePlaceholder")}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            ) : (
              <Text style={styles.username}>@{user.username}</Text>
            )}
            
            <Text style={styles.email}>{session.user.email}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("profile.accountSettings")}</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>{t("common.language")}</Text>
              {isEditing ? (
                <View style={styles.languageSelector}>
                  {locales.map((lang) => (
                    <TouchableOpacity
                      key={lang}
                      style={[
                        styles.languageOption,
                        selectedLanguage === lang && styles.selectedLanguage,
                      ]}
                      onPress={() => handleLanguageChange(lang)}
                    >
                      <Text
                        style={[
                          styles.languageText,
                          selectedLanguage === lang && styles.selectedLanguageText,
                        ]}
                      >
                        {lang.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.settingValue}>{user.language.toUpperCase()}</Text>
              )}
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>{t("common.premium")}</Text>
              <Text
                style={[
                  styles.settingValue,
                  user.is_premium && styles.premiumText,
                ]}
              >
                {user.is_premium ? t("home.premium") : t("home.standard")}
              </Text>
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>{t("profile.memberSince")}</Text>
              <Text style={styles.settingValue}>
                {new Date(user.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            {isEditing && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelButtonText}>{t("common.cancel")}</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.button}
              onPress={handleTogglePremium}
            >
              <Text style={styles.buttonText}>
                {user.is_premium
                  ? t("home.cancelPremium")
                  : t("home.goPremium")}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.signOutButton]}
              onPress={handleSignOut}
            >
              <Text style={styles.signOutText}>{t("common.signOut")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tadado.primary,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.xl,
    color: "#FBAA12",
    flex: 1,
    textAlign: "center",
  },
  editButton: {
    padding: Spacing.sm,
  },
  editButtonText: {
    ...Typography.body.semiBold,
    color: "#FBAA12",
    fontSize: FontSizes.base,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing["3xl"],
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#FBAA12",
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1a0a2b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FBAA12",
  },
  avatarInitial: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["3xl"],
    color: "#FBAA12",
  },
  premiumBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.tadado.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FBAA12",
  },
  premiumBadgeText: {
    fontSize: 16,
  },
  username: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.xl,
    color: "#FBAA12",
    marginBottom: Spacing.xs,
  },
  usernameInput: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
    color: "#FBAA12",
    backgroundColor: "rgba(26, 10, 43, 0.7)",
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
    minWidth: 200,
    textAlign: "center",
  },
  email: {
    ...Typography.body.regular,
    fontSize: FontSizes.sm,
    color: "#ffffff",
    opacity: 0.8,
  },
  section: {
    backgroundColor: "rgba(26, 10, 43, 0.7)",
    borderRadius: 16,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
    color: "#FBAA12",
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingLabel: {
    ...Typography.body.medium,
    fontSize: FontSizes.base,
    color: "#ffffff",
    opacity: 0.9,
  },
  settingValue: {
    ...Typography.body.regular,
    fontSize: FontSizes.base,
    color: "#ffffff",
  },
  premiumText: {
    color: "#FBAA12",
    ...Typography.body.semiBold,
  },
  languageSelector: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  languageOption: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedLanguage: {
    backgroundColor: "#FBAA12",
  },
  languageText: {
    ...Typography.body.medium,
    fontSize: FontSizes.sm,
    color: "#ffffff",
  },
  selectedLanguageText: {
    color: "#1a0a2b",
  },
  actions: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  button: {
    backgroundColor: "#FBAA12",
    padding: Spacing.md,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.base,
    color: "#2a0a3b",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  cancelButtonText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.base,
    color: "#ffffff",
  },
  signOutButton: {
    backgroundColor: "#D92151",
    marginTop: Spacing.md,
  },
  signOutText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.base,
    color: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...Typography.body.medium,
    fontSize: FontSizes.lg,
    color: "#FBAA12",
    marginTop: Spacing.md,
  },
});
