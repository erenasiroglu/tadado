import Colors from "@/constants/Colors";
import { BorderRadius, Spacing } from "@/constants/Spacing";
import { FontSizes, Typography } from "@/constants/Typography";
import { useLanguage } from "@/contexts/LanguageContext";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface GameCardProps {
  type: "classic" | "dirty" | "custom";
  onPress: () => void;
  onPreview: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  type,
  onPress,
  onPreview,
}) => {
  const { t } = useLanguage();
  const cardConfig = {
    classic: {
      backgroundColor: Colors.tadado.card.classic,
      textColor: Colors.tadado.text.classic,
      title: t("games.classicTitle"),
      showR18: false,
    },
    dirty: {
      backgroundColor: Colors.tadado.card.dirty,
      textColor: Colors.tadado.text.dirty,
      title: t("games.dirtyTitle"),
      showR18: true,
    },
    custom: {
      backgroundColor: Colors.tadado.card.custom,
      textColor: Colors.tadado.text.custom,
      title: t("games.customTitle"),
      showR18: false,
    },
  };

  const config = cardConfig[type];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: config.backgroundColor }]}
        onPress={onPress}
      >
        <View style={styles.cardContent}>
          <View style={styles.topSection}>
            <Text style={[styles.title, { color: config.textColor }]}>
              {config.title}
            </Text>
          </View>
          
          <View style={styles.middleSection}>
            {config.showR18 && (
              <View style={styles.r18Badge}>
                <Text style={styles.r18Text}>{t("games.r18")}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={[
                styles.previewButton,
                { backgroundColor: config.textColor },
              ]}
              onPress={onPreview}
            >
              <Text
                style={[styles.previewText, { color: config.backgroundColor }]}
              >
                {t("games.previewButton")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: Spacing.sm,
  },
  card: {
    width: 116,
    height: 184,
    borderRadius: BorderRadius.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.sm,
    paddingTop: Spacing.md - Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  topSection: {
    alignItems: "center",
  },
  middleSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    width: "100%",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  title: {
    ...Typography.heading.semiBold,
    fontSize: 22,
    textAlign: "center",
    lineHeight: 40,
  },
  r18Badge: {
    backgroundColor: Colors.tadado.danger,
    borderRadius: BorderRadius.md + 1,
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  r18Text: {
    ...Typography.r18.semiBold,
    fontSize: FontSizes.sm,
    color: "#5D022C",
  },
  previewButton: {
    width: 75,
    height: 23,
    borderRadius: BorderRadius.sm + 4,
    justifyContent: "center",
    alignItems: "center",
  },
  previewText: {
    ...Typography.body.semiBold,
    fontSize: FontSizes.xs,
    textAlign: "center",
  },
});
