import { Spacing } from "@/constants/Spacing";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card } from "./Card";

interface HorizontalCardScrollProps {
  onCardPress: (index: number) => void;
  onBuyPress: (index: number) => void;
}

export const HorizontalCardScroll: React.FC<HorizontalCardScrollProps> = ({
  onCardPress,
  onBuyPress,
}) => {
  // Sample data - you can replace this with actual data from your API
  const cards = [
    {
      id: 1,
      type: "romance",
    },
    {
      id: 2,
      type: "travel",
    },
    {
      id: 3,
      type: "adventure",
    },
    {
      id: 4,
      type: "party",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={155 + Spacing.sm * 2} // card width + margins
        snapToAlignment="start"
      >
        {cards.map((card, index) => (
          <Card
            key={card.id}
            type={card.type}
            title="" // Title will be provided by translation in Card component
            description="" // Description will be provided by translation in Card component
            onPress={() => onCardPress(index)}
            onBuy={() => onBuyPress(index)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
    paddingHorizontal: 0, // Ana content ile aynı hizada
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
  },
});
