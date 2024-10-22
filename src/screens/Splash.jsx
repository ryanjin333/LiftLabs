import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Video } from "expo-av";
import { useDispatch, useSelector } from "react-redux";
import { splashScreenTransition } from "../context/animationSlice";
import Animated, { Easing, FadeIn, FadeOut } from "react-native-reanimated";
import LottieView from "lottie-react-native";

const videoSource = require("../../assets/splash.mp4");

const Splash = ({ onSplashEnd }) => {
  // redux
  const dispatch = useDispatch();
  const splashScreenVisible = useSelector(
    (state) => state.animation.splashScreenVisible
  );

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
          exiting={FadeOut.duration(500)}
          className="h-full w-full bg-black items-center justify-center"
        >
          <Video
            source={videoSource}
            className="h-3/5 w-full"
            isLooping
            isMuted
            shouldPlay
            resizeMode="contain"
            useNativeControls={false}
          />

          <LottieView
            source={require("../assets/loading_animation.json")}
            className=" w-48 h-48"
            autoPlay
            loop
          />
        </Animated.View>
      )}
    </>
  );
};

export default Splash;
