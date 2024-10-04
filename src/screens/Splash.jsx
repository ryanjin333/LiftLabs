import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useVideoPlayer, VideoView } from "expo-video";

const videoSource = require("../../assets/splash.mp4");

const Splash = ({ onSplashEnd }) => {
  // initial animation for splash screen
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });
  useEffect(() => {
    // Timer to hide splash after a certain duration
    const timer = setTimeout(() => {
      onSplashEnd(); // Hide splash and show main content
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <View className="h-full w-full bg-black items-center justify-center">
      <VideoView className=" h-full w-full" player={player} />
    </View>
  );
};

export default Splash;
