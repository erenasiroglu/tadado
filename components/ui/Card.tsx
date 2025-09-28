import { BorderRadius, Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import { useLanguage } from "@/contexts/LanguageContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CardProps {
  title: string;
  description: string;
  type: "romance" | "travel" | "adventure" | string;
  onPress: () => void;
  onBuy: () => void;
  isNew?: boolean;
  isFree?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  type,
  onPress,
  onBuy,
  isNew = false,
  isFree = false,
}) => {
  const { t } = useLanguage();
  // Determine gradient colors based on type
  const getGradientColors = (): [string, string] => {
    switch (type) {
      case "romance":
        return ["rgba(213, 124, 157, 0.8)", "rgba(255, 44, 122, 0.8)"];
      case "travel":
        return ["rgba(56, 20, 93, 0.8)", "rgba(93, 51, 145, 0.8)"];
      case "adventure":
        return ["rgba(34, 139, 34, 0.8)", "rgba(0, 100, 0, 0.8)"];
      default:
        return ["rgba(56, 20, 93, 0.8)", "rgba(93, 51, 145, 0.8)"];
    }
  };

  // Determine button and text colors based on type
  const getButtonColor = () => {
    switch (type) {
      case "romance":
        return "#5D022C";
      case "travel":
        return "#38145D";
      case "adventure":
        return "#0F4C0F";
      default:
        return "#38145D";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "romance":
        return "#5D022C";
      case "travel":
        return "#FBAA12";
      case "adventure":
        return "#90EE90";
      default:
        return "#FBAA12";
    }
  };

  const getButtonTextColor = () => {
    switch (type) {
      case "romance":
        return "#FF2C7A";
      case "travel":
        return "#FBAA12";
      case "adventure":
        return "#90EE90";
      default:
        return "#FBAA12";
    }
  };

  const getPlayIconBackgroundColor = () => {
    switch (type) {
      case "romance":
        return "#C77B9C";
      case "travel":
        return "#6E4EA3";
      case "adventure":
        return "#32CD32";
      default:
        return "#6E4EA3";
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* NEW Button */}
        {isNew && (
          <View style={styles.newButtonContainer}>
            <View
              style={[styles.newButton, { backgroundColor: getButtonColor() }]}
            >
              <Text
                style={[styles.newButtonText, { color: getButtonTextColor() }]}
              >
                {t("new")}
              </Text>
            </View>
          </View>
        )}

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Play Icon Section */}
          <View style={styles.playSection}>
            <View style={styles.playIconContainer}>
              <View
                style={[
                  styles.playIconBackground,
                  { backgroundColor: getPlayIconBackgroundColor() },
                ]}
              >
                <Text style={styles.playIcon}>▶</Text>
              </View>
            </View>
          </View>

          {/* Title and Description */}
          <View style={styles.textSection}>
            <Text style={[styles.title, { color: getTextColor() }]}>
              {t(type)}
            </Text>
            <Text style={[styles.description, { color: getTextColor() }]}>
              {t(`${type}Description`)}
            </Text>
          </View>
        </View>

        {/* BUY Button (hidden for free cards) */}
        {!isFree && (
          <View style={styles.buyButtonContainer}>
            <TouchableOpacity
              style={[styles.buyButton, { backgroundColor: getButtonColor() }]}
              onPress={onBuy}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.buyButtonText, { color: getButtonTextColor() }]}
              >
                {t("buy", { price: "2.99$" })}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.sm,
  },
  card: {
    width: 155,
    height: 223,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  newButtonContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
  },
  newButton: {
    width: 54,
    height: 23,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  newButtonText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.xs,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 40,
    paddingBottom: 50, // BUY button için yer bırakıyoruz
  },
  playSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  playIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  playIconBackground: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    fontSize: 20,
    color: "#FFFF",
    marginLeft: 2,
  },
  textSection: {
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    marginTop: 20,
  },
  title: {
    ...Typography.heading.semiBold,
    fontSize: FontSizes.lg,
    marginBottom: 4,
  },
  description: {
    ...Typography.body.regular,
    fontSize: FontSizes.xs,
    opacity: 0.65,
    textAlign: "center",
    lineHeight: 16,
  },
  buyButtonContainer: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
  },
  buyButton: {
    width: 70,
    height: 23,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buyButtonText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.xs,
  },
});
