import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      if (!email || !password) {
        Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
        return;
      }

      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
        }
      );

      if (signUpError) {
        console.error("Auth error:", signUpError);
        throw signUpError;
      }

      if (!authData?.user?.id) {
        throw new Error("Kullanıcı kaydı oluşturulamadı.");
      }

      const { error: userError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: email,
      });

      if (userError) {
        console.error("Database error:", userError);
        throw userError;
      }

      Alert.alert(
        "Kayıt Başarılı",
        "Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.",
        [
          {
            text: "Tamam",
            onPress: () => router.replace("/"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Hata", error.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text
            style={[{ fontFamily: "Inter", fontWeight: "700" }, styles.title]}
          >
            Hesap Oluştur
          </Text>
          <Text
            style={[
              { fontFamily: "Inter", fontWeight: "700" },
              styles.subtitle,
            ]}
          >
            Tadado&apos;ya hoş geldiniz!
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="example@email.com"
                placeholderTextColor="#999999"
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
                placeholderTextColor="#999999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.disabledButton]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.signUpButtonText}>
                {loading ? "İşleniyor..." : "Kayıt Ol"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Zaten hesabınız var mı? </Text>
          <TouchableOpacity
            onPress={() => router.replace("/")}
            disabled={loading}
          >
            <Text style={[styles.signInText, loading && styles.disabledText]}>
              Giriş Yap
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#ffa07d",
  },
  scrollContent: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    color: "#333333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffff",
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 32,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#333333",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  signUpButton: {
    backgroundColor: "#007c88",
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: "#f7d705",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signUpButtonText: {
    color: "#ffffff",
    fontSize: 18,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  footerText: {
    color: "#ffff",
    fontSize: 15,
  },
  signInText: {
    color: "#333333",
    fontSize: 15,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.7,
  },
  disabledText: {
    opacity: 0.7,
  },
});
