import Colors from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const { checkUsername, isChecking } = useUsernameCheck();
  const { t } = useLanguage();

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert(t("auth.error"), t("auth.emailRequired"));
      return false;
    }
    if (password.length < 6) {
      Alert.alert(t("auth.error"), t("auth.passwordMinLength"));
      return false;
    }
    if (!username.trim()) {
      Alert.alert(t("auth.error"), t("auth.usernameRequired"));
      return false;
    }
    if (username.length < 3) {
      Alert.alert(t("auth.error"), t("auth.usernameMinLength"));
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Check username availability
      const isUsernameAvailable = await checkUsername(username);
      if (!isUsernameAvailable) {
        Alert.alert(t("auth.error"), t("auth.usernameTaken"));
        return;
      }

      const result = await signUp(email, password, username);
      if (result.success) {
        Alert.alert(t("auth.success"), t("auth.signupSuccess"), [
          {
            text: t("common.ok"),
            onPress: () => router.replace("/(auth)/login"),
          },
        ]);
      } else {
        Alert.alert(t("auth.error"), result.error || t("auth.signupFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <LinearGradient
        colors={[Colors.tadado.primary, "#2a0a3b"]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Image
                style={styles.logo}
                resizeMode="contain"
                source={require("@/assets/images/tado.svg")}
              />
              <Text style={styles.title}>{t("auth.joinTadado")}</Text>
              <Text style={styles.subtitle}>{t("auth.createAccount")}</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t("auth.username")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t("auth.usernamePlaceholder")}
                  placeholderTextColor="#666"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t("auth.email")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t("auth.emailPlaceholder")}
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t("auth.password")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t("auth.passwordPlaceholder")}
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  (loading || isChecking) && styles.buttonDisabled,
                ]}
                onPress={handleSignup}
                disabled={loading || isChecking}
              >
                {loading ? (
                  <ActivityIndicator color="#2a0a3b" />
                ) : (
                  <Text style={styles.buttonText}>{t("auth.signUp")}</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>{t("auth.haveAccount")} </Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity>
                    <Text style={styles.linkText}>{t("auth.signIn")}</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["3xl"],
    color: "#FBAA12",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body.regular,
    fontSize: FontSizes.lg,
    color: "#ffffff",
    textAlign: "center",
    opacity: 0.8,
  },
  form: {
    backgroundColor: "rgba(26, 10, 43, 0.9)",
    padding: Spacing.xl,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(251, 170, 18, 0.2)",
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.base,
    color: "#FBAA12",
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(251, 170, 18, 0.3)",
    borderRadius: 16,
    padding: Spacing.md,
    fontSize: FontSizes.base,
    color: "#ffffff",
    ...Typography.body.regular,
  },
  button: {
    backgroundColor: "#FBAA12",
    padding: Spacing.md,
    borderRadius: 16,
    alignItems: "center",
    marginTop: Spacing.sm,
    shadowColor: "#FBAA12",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: "rgba(251, 170, 18, 0.5)",
  },
  buttonText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.lg,
    color: "#2a0a3b",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
  footerText: {
    ...Typography.body.regular,
    fontSize: FontSizes.base,
    color: "#ffffff",
    opacity: 0.8,
  },
  linkText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.base,
    color: "#FBAA12",
  },
});
