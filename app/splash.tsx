import { router } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const player = useVideoPlayer(
    require("@/assets/animations/tadado.mp4"),
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/signin");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />
      <Text style={styles.text}>Tadado</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  text: {
    fontSize: 36,
    color: "#333333",
    textAlign: "center",
  },
});
