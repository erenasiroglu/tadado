import { useNotification } from "@/lib/NotificationContext";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const { showNotification } = useNotification();

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      if (!email || !password) {
        showNotification({
          type: "warning",
          message: "Lütfen email ve şifrenizi girin",
          duration: 3000,
        });
        return;
      }

      console.log("Giriş denemesi yapılıyor...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Giriş hatası:", error.message);
        if (error.message.includes("Email not confirmed")) {
          showNotification({
            type: "warning",
            message: "Email adresinizi doğrulayın veya yöneticinize başvurun",
            duration: 4000,
          });
        } else {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

          if (userError) {
            console.error("Kullanıcı verisi kontrol hatası:", userError);
          } else {
            console.log("Kullanıcı verisi:", userData);
          }

          showNotification({
            type: "error",
            message: "Email veya şifre hatalı",
            duration: 3000,
          });
        }
        return;
      }

      if (data?.user) {
        console.log("Giriş başarılı:", data.user);
        showNotification({
          type: "success",
          message: "Giriş başarılı! Yönlendiriliyorsunuz...",
          duration: 2000,
        });
        setTimeout(() => {
          router.replace("/dashboard");
        }, 1000);
      }
    } catch (error: any) {
      console.error("Beklenmeyen hata:", error);
      showNotification({
        type: "error",
        message: "Bir hata oluştu. Lütfen tekrar deneyin",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={["#1A1A1A", "#2D2D2D"]}
          style={styles.background}
        />
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.logo}>Tadado</Text>
              <Text style={styles.subtitle}>
                AI ile Tabu, yeniden hayal edildi!
              </Text>
            </View>

            <Animated.View
              style={[
                styles.card,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="example@email.com"
                    placeholderTextColor="#666666"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!loading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Şifre</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#666666"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete="password"
                    editable={!loading}
                  />
                </View>

                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={() => router.push("/forgot-password")}
                >
                  <Text style={styles.forgotPasswordText}>
                    Şifremi Unuttum?
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.signInButton,
                    loading && styles.disabledButton,
                  ]}
                  onPress={handleSignIn}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={["#ffa07d", "#ff7d5d"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.signInButtonGradient}
                  >
                    <Icon
                      name="sign-in"
                      size={20}
                      color="#FFFFFF"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.signInButtonText}>
                      {loading ? "İşleniyor..." : "Giriş Yap"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Hesabın yok mu? </Text>
              <TouchableOpacity
                onPress={() => router.push("/signup")}
                disabled={loading}
              >
                <Text
                  style={[styles.signUpText, loading && styles.disabledText]}
                >
                  Kayıt Ol
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 40,
  },
  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#ffa07d",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF80",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333333",
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#333333",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#444444",
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: "#ffa07d",
    fontSize: 14,
  },
  signInButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
  },
  signInButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  buttonIcon: {
    marginRight: 10,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#FFFFFF80",
  },
  signUpText: {
    fontSize: 16,
    color: "#ffa07d",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.6,
  },
});
