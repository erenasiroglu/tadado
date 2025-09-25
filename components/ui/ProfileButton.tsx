import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { SupportedLanguage } from "@/i18n/types";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface ProfileButtonProps {
  size?: number;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({ size = 40 }) => {
  const { user, session, signOut, updateUserProfile } = useAuth();
  const { t, locale, setLocale, locales } = useLanguage();
  const [menuVisible, setMenuVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    if (menuVisible) {
      // Close menu with animation
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setMenuVisible(false);
      });
    } else {
      // Open menu with animation
      setMenuVisible(true);
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleProfilePress = () => {
    toggleMenu();
    if (!session || !user) {
      router.push("/(auth)/login");
    }
  };

  const handleLanguageChange = async (lang: {
    code: SupportedLanguage;
    name: string;
  }) => {
    if (!user) return;

    toggleMenu();

    try {
      // Update language in context
      await setLocale(lang.code as any);

      // Update user profile in database if user is logged in
      if (session) {
        const result = await updateUserProfile({
          language: lang.code,
        });

        if (!result.success) {
          console.error("Failed to update language in profile:", result.error);
        }
      }
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const handleSignOut = () => {
    toggleMenu();
    Alert.alert(t("signOut"), t("signOutConfirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("signOut"),
        style: "destructive",
        onPress: signOut,
      },
    ]);
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.container,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
        onPress={toggleMenu}
      >
        {session && user ? (
          // User is logged in, show first letter of username
          <Text style={styles.initial}>
            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
          </Text>
        ) : (
          // User is not logged in, show user icon
          <FontAwesome name="user" size={size / 2.5} color="#FBAA12" />
        )}
      </TouchableOpacity>

      {/* Dropdown Menu Modal */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="none"
        onRequestClose={toggleMenu}
      >
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <Animated.View
                style={[
                  styles.menuContainer,
                  {
                    transform: [{ scale: scaleAnim }],
                    opacity: scaleAnim,
                  },
                ]}
              >
                {/* User info section - simplified */}
                {session && user ? (
                  <View style={styles.userInfoSection}>
                    <Text style={styles.userName}>@{user.username}</Text>
                  </View>
                ) : null}

                {/* Sign in button for non-logged users */}
                {!session || !user ? (
                  <TouchableOpacity
                    style={styles.signInButton}
                    onPress={handleProfilePress}
                  >
                    <FontAwesome name="sign-in" size={16} color="#FBAA12" />
                    <Text style={styles.signInText}>{t("signIn")}</Text>
                  </TouchableOpacity>
                ) : null}

                {/* Language selector */}
                <View style={styles.languageSection}>
                  <View style={styles.languageOptions}>
                    {locales.map(
                      (lang: { code: SupportedLanguage; name: string }) => (
                        <TouchableOpacity
                          key={lang.code}
                          style={[
                            styles.languageOption,
                            locale === lang.code && styles.activeLanguage,
                          ]}
                          onPress={() => handleLanguageChange(lang)}
                        >
                          <Text
                            style={[
                              styles.languageText,
                              locale === lang.code && styles.activeLanguageText,
                            ]}
                          >
                            {lang.code.toUpperCase()}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                </View>

                {/* Sign out option (only if logged in) */}
                {session && user && (
                  <TouchableOpacity
                    style={[styles.menuItem, styles.signOutItem]}
                    onPress={handleSignOut}
                  >
                    <Ionicons
                      name="log-out-outline"
                      size={20}
                      color="#D92151"
                    />
                    <Text style={styles.signOutText}>{t("signOut")}</Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuContainer: {
    backgroundColor: "rgba(26, 10, 43, 0.95)",
    borderRadius: 12,
    marginTop: 80,
    marginRight: 16,
    width: 200,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  userInfoSection: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginBottom: 8,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2a0a3b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FBAA12",
    marginRight: Spacing.md,
  },
  userAvatarText: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
    color: "#FBAA12",
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    ...Typography.body.semiBold,
    fontSize: 14,
    color: "#FBAA12",
  },
  userEmail: {
    ...Typography.body.regular,
    fontSize: FontSizes.sm,
    color: "#ffffff",
    opacity: 0.7,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
  },
  menuItemText: {
    ...Typography.body.medium,
    fontSize: FontSizes.base,
    color: "#ffffff",
    marginLeft: Spacing.md,
  },
  languageSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 4,
  },
  languageTitle: {
    ...Typography.body.semiBold,
    fontSize: 12,
    color: "#FBAA12",
    marginBottom: 8,
  },
  languageOptions: {
    flexDirection: "row",
    gap: 8,
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  activeLanguage: {
    backgroundColor: "#FBAA12",
    borderColor: "#FBAA12",
  },
  languageText: {
    ...Typography.body.medium,
    fontSize: 12,
    color: "#ffffff",
  },
  activeLanguageText: {
    color: "#1a0a2b",
  },
  signOutItem: {
    marginTop: 4,
  },
  signOutText: {
    ...Typography.body.medium,
    fontSize: 14,
    color: "#D92151",
    marginLeft: 12,
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(251, 170, 18, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(251, 170, 18, 0.3)",
  },
  signInText: {
    ...Typography.body.medium,
    fontSize: 14,
    color: "#FBAA12",
    marginLeft: 8,
  },
});
