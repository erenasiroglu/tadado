import { useNotification } from "@/lib/NotificationContext";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  ColorValue,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

interface CardButtonProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  gradient: [ColorValue, ColorValue];
}

export default function DashboardScreen() {
  const [displayName, setDisplayName] = useState<string>("");
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const { showNotification } = useNotification();

  useEffect(() => {
    checkUser();
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

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/");
      return;
    }
    const email = user.email || "";
    const name = email
      .split("@")[0]
      .replace(".", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    setDisplayName(name);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      showNotification({
        type: "success",
        message: "Başarıyla çıkış yapıldı",
        duration: 2000,
      });

      setTimeout(() => {
        router.replace("/");
      }, 1000);
    } catch (error: any) {
      showNotification({
        type: "error",
        message: error.message || "Çıkış yapılırken bir hata oluştu",
        duration: 3000,
      });
    }
  };

  const CardButton = ({
    icon,
    title,
    description,
    onPress,
    gradient,
  }: CardButtonProps) => (
    <Animated.View
      style={[
        styles.cardContainer,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity style={styles.cardTouchable} onPress={onPress}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardIcon}>
              <Icon name={icon} size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardText}>{description}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={["#1A1A1A", "#2D2D2D"]}
          style={styles.background}
        />

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>Tadado</Text>
            <Text style={styles.tagline}>AI Destekli Tabu Oyunu</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={handleLogout}>
            <Text style={styles.profileName}>{displayName}</Text>
            <View style={styles.logoutIcon}>
              <Icon name="sign-out" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => router.push("/(tabs)/new-game" as any)}
          >
            <LinearGradient
              colors={["#ffa07d", "#ff7d5d"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButtonGradient}
            >
              <Icon
                name="play"
                size={24}
                color="#FFFFFF"
                style={styles.startIcon}
              />
              <Text style={styles.startButtonText}>Yeni Oyun Başlat</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.cardsGrid}>
            <CardButton
              icon="folder"
              title="Oyunlarım"
              description="Özel kelime setlerini keşfet"
              onPress={() => router.push("/(tabs)/my-games" as any)}
              gradient={["#4A90E2", "#357ABD"] as [ColorValue, ColorValue]}
            />

            <CardButton
              icon="lightbulb-o"
              title="AI Önerileri"
              description="Kişiselleştirilmiş kelime setleri"
              onPress={() => router.push("/(tabs)/ai-suggestions" as any)}
              gradient={["#9B59B6", "#8E44AD"] as [ColorValue, ColorValue]}
            />

            <CardButton
              icon="trophy"
              title="Liderlik Tablosu"
              description="En iyiler arasına katıl"
              onPress={() => router.push("/(tabs)/leaderboards" as any)}
              gradient={["#E67E22", "#D35400"] as [ColorValue, ColorValue]}
            />
          </View>
        </ScrollView>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffa07d",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: "#FFFFFF80",
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333333",
    padding: 12,
    borderRadius: 20,
  },
  profileName: {
    color: "#FFFFFF",
    marginRight: 8,
    fontSize: 14,
  },
  logoutIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#ffa07d",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  startButton: {
    marginVertical: 20,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#ffa07d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  startIcon: {
    marginRight: 12,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardsGrid: {
    flexDirection: "column",
    gap: 16,
  },
  cardContainer: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardTouchable: {
    flex: 1,
  },
  card: {
    padding: 20,
    height: 140,
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#FFFFFF90",
  },
});
