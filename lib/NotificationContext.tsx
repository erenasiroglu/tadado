import { LinearGradient } from "expo-linear-gradient";
import React, { createContext, useCallback, useContext, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationConfig {
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (config: NotificationConfig) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const NOTIFICATION_HEIGHT = 80;
const { width } = Dimensions.get("window");

const getNotificationConfig = (type: NotificationType) => {
  switch (type) {
    case "success":
      return {
        icon: "check-circle",
        colors: ["#4CAF50", "#45a049"],
        emoji: "✨",
      };
    case "error":
      return {
        icon: "times-circle",
        colors: ["#f44336", "#d32f2f"],
        emoji: "❌",
      };
    case "warning":
      return {
        icon: "exclamation-circle",
        colors: ["#ff9800", "#f57c00"],
        emoji: "⚠️",
      };
    case "info":
    default:
      return {
        icon: "info-circle",
        colors: ["#2196F3", "#1976D2"],
        emoji: "ℹ️",
      };
  }
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [currentNotification, setCurrentNotification] =
    useState<NotificationConfig | null>(null);
  const translateY = useState(new Animated.Value(-NOTIFICATION_HEIGHT))[0];

  const hideNotification = useCallback(() => {
    Animated.timing(translateY, {
      toValue: -NOTIFICATION_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      setCurrentNotification(null);
    });
  }, [translateY]);

  const showNotification = useCallback(
    (config: NotificationConfig) => {
      setCurrentNotification(config);
      setVisible(true);

      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(config.duration || 3000),
        Animated.timing(translateY, {
          toValue: -NOTIFICATION_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
        setCurrentNotification(null);
      });
    },
    [translateY]
  );

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {visible && currentNotification && (
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <LinearGradient
            colors={getNotificationConfig(currentNotification.type).colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <Icon
                  name={getNotificationConfig(currentNotification.type).icon}
                  size={24}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.message}>
                {getNotificationConfig(currentNotification.type).emoji}{" "}
                {currentNotification.message}
              </Text>
              <TouchableOpacity
                onPress={hideNotification}
                style={styles.closeButton}
              >
                <Icon name="times" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      )}
      {children}
    </NotificationContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    minHeight: NOTIFICATION_HEIGHT,
    width: width,
    paddingTop: 35, // Status bar height
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    padding: 5,
  },
});

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
