import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { useDispatch, useSelector } from "react-redux";
import { splashScreenTransition } from "../context/animationSlice";
import Animated, { Easing, FadeIn, FadeOut } from "react-native-reanimated";

const videoSource = require("../../assets/splash.mp4");

const Splash = ({ onSplashEnd }) => {
  // redux
  const dispatch = useDispatch();
  const splashScreenVisible = useSelector(
    (state) => state.animation.splashScreenVisible
  );

  // initial animation for splash screen
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });
  useEffect(() => {
    // Timer to hide splash after a certain duration
    dispatch(splashScreenTransition());
    const timer = setTimeout(() => {
      onSplashEnd();
    }, 7000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {splashScreenVisible && (
        <Animated.View
          entering={FadeIn.duration(2000)}
          exiting={FadeOut.duration(2000)}
          className="h-full w-full bg-black items-center justify-center"
        >
          <VideoView className=" h-full w-full" player={player} />
        </Animated.View>
      )}
    </>
  );
};

export default Splash;
