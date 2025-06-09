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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
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

  const handleResetPassword = async () => {
    try {
      setLoading(true);

      if (!email) {
        showNotification({
          type: "warning",
          message: "Lütfen email adresinizi girin",
          duration: 3000,
        });
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "tadado://reset-password",
      });

      if (error) {
        throw error;
      }

      showNotification({
        type: "success",
        message: "Şifre sıfırlama bağlantısı email adresinize gönderildi",
        duration: 4000,
      });

      setTimeout(() => {
        router.replace("/");
      }, 2000);
    } catch (error: any) {
      console.error("Şifre sıfırlama hatası:", error);
      showNotification({
        type: "error",
        message: error.message || "Şifre sıfırlama işlemi başarısız oldu",
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Icon name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.logo}>Tadado</Text>
              <Text style={styles.subtitle}>Şifrenizi mi unuttunuz?</Text>
              <Text style={styles.description}>
                Email adresinizi girin, size şifre sıfırlama bağlantısı
                gönderelim
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

                <TouchableOpacity
                  style={[styles.resetButton, loading && styles.disabledButton]}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={["#ffa07d", "#ff7d5d"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.resetButtonGradient}
                  >
                    <Icon
                      name="envelope"
                      size={20}
                      color="#FFFFFF"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.resetButtonText}>
                      {loading ? "İşleniyor..." : "Sıfırlama Bağlantısı Gönder"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#ffa07d",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    color: "#FFFFFF",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#FFFFFF80",
    textAlign: "center",
    paddingHorizontal: 20,
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
  resetButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
  },
  resetButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  buttonIcon: {
    marginRight: 10,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
