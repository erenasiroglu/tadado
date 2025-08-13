import { BorderRadius, Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TravelCardProps {
  onPress: () => void;
  onBuy: () => void;
  title?: string;
  description?: string;
}

export const TravelCard: React.FC<TravelCardProps> = ({
  onPress,
  onBuy,
  title = "TRAVEL",
  description = "Explore Guess and Laugh!",
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={["rgba(117, 42, 195, 0.8)", "rgba(56, 20, 93, 0.8)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* NEW Button */}
        <View style={styles.newButtonContainer}>
          <View style={styles.newButton}>
            <Text style={styles.newButtonText}>NEW</Text>
          </View>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Play Icon Section */}
          <View style={styles.playSection}>
            <View style={styles.playIconContainer}>
              <View style={styles.playIconBackground}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            </View>
          </View>

          {/* Title and Description */}
          <View style={styles.textSection}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>

        {/* BUY Button */}
        <View style={styles.buyButtonContainer}>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={onBuy}
            activeOpacity={0.8}
          >
            <Text style={styles.buyButtonText}>BUY 7.99$</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#FBAA12",
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  newButtonText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.xs,
    color: "#38145D",
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
    backgroundColor: "#C77B9C",
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
    color: "#FBAA12",
    marginBottom: 4,
  },
  description: {
    ...Typography.body.regular,
    fontSize: FontSizes.xs,
    color: "#FBAA12",
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
    backgroundColor: "#FBAA12",
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buyButtonText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.xs,
    color: "#38145D",
  },
});
