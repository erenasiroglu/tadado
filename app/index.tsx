import * as SplashScreen from "expo-splash-screen";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

SplashScreen.preventAutoHideAsync().catch(() => {});

function SplashVideoScreen({ onFinish }: { onFinish: () => void }) {
  const player = useVideoPlayer(
    require("@/assets/animations/tadado.mp4"),
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().finally(() => onFinish());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.loadingContainer}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />
      <Text style={styles.loadingText}>Tadado</Text>
    </View>
  );
}

export default function HomeScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen email ve şifrenizi girin.");
      return;
    }
    Alert.alert("Başarılı", "Giriş yapıldı!");
  };

  if (showSplash) {
    return <SplashVideoScreen onFinish={() => setShowSplash(false)} />;
  }

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
            Tadado.
          </Text>
          <Text
            style={[
              { fontFamily: "Inter", fontWeight: "700" },
              styles.subtitle,
            ]}
          >
            AI Tabuu game, reimagined.
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
              />
            </View>

            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
            >
              <Text style={styles.signInButtonText}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hesabınız yok mu? </Text>
          <TouchableOpacity>
            <Text style={styles.signUpText}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 30,
  },
  loadingText: {
    fontSize: 36,
    color: "#333333",
    textAlign: "center",
  },
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
    fontSize: 42,
    color: "#333333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
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
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: -8,
  },
  forgotPasswordText: {
    color: "#3333",
    fontSize: 14,
  },
  signInButton: {
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
  signInButtonText: {
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
  signUpText: {
    color: "#333333",
    fontSize: 15,
  },
});
