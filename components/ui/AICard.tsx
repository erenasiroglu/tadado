import Colors from "@/constants/Colors";
import { BorderRadius, Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import { useLanguage } from "@/contexts/LanguageContext";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface AICardProps {
  onPress: () => void;
}

export const AICard: React.FC<AICardProps> = ({ onPress }) => {
  const { t } = useLanguage();
  const scale = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(0)).current;
  // reserved for future ambient effects
  const [topicIndex, setTopicIndex] = useState(0);
  // Get topics array from translations
  const topicsArray = t("ai.topics", {}, true);

  useEffect(() => {
    let mounted = true;
    const tick = () => {
      fade.setValue(0);
      Animated.timing(fade, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished || !mounted) return;
        setTimeout(() => {
          setTopicIndex((i) => (i + 1) % topicsArray.length);
          if (mounted) tick();
        }, 900);
      });
    };
    tick();
    return () => {
      mounted = false;
    };
  }, [fade, topicsArray.length]);

  useEffect(() => {
    // Reserved for future subtle ambient motions if needed
  }, []);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 6,
      tension: 180,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 180,
    }).start();
  };

  const handlePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    onPress();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <Pressable
        style={styles.pressable}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="Create deck with AI"
      >
      <LinearGradient
        colors={["#0C0714", "#120A1F", "#0B0714"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <Text style={styles.title}>{t("ai.title")}<Text style={styles.titleFaint}>{t("ai.titleFaint")}</Text></Text>
          <Text style={styles.subtitle}>{t("ai.subtitle")}</Text>
        </View>
      </View>

      <View style={styles.teaserArea}>
        <Animated.Text
          style={[
            styles.topic,
            {
              opacity: fade,
              transform: [
                {
                  translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }),
                },
                {
                  scale: fade.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] }),
                },
              ],
            },
          ]}
        >
          {topicsArray[topicIndex]}
        </Animated.Text>
        
      </View>
      {/* gradient only; removed blobs for a sleeker modern dark look */}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 190,
    backgroundColor: Colors.tadado.dark,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pressable: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleCol: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  title: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["2xl"],
    color: "#ffffff",
  },
  titleFaint: {
    color: Colors.tadado.secondary,
  },
  subtitle: {
    ...Typography.body.regular,
    fontSize: FontSizes.sm,
    color: "#ffffff",
    opacity: 0.8,
    marginTop: Spacing.xs,
  },
  teaserArea: {
    flex: 1,
    marginTop: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  topic: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes["3xl"],
    color: Colors.tadado.secondary,
    letterSpacing: 0.5,
  },
  
  
});
