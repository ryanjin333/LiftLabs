import { View, Text } from "react-native";
import { IntroScene } from "../scenes";
import {
  GradientButton,
  GradientText,
  LoginSignupSwitcher,
} from "../components";
import Animated, {
  FadeIn,
  FadeOut,
  FadeInUp,
  FadeInDown,
  FadeInLeft,
  FadeOutLeft,
  FadeOutUp,
  FadeOutDown,
  useSharedValue,
  useAnimatedScrollHandler,
  useDerivedValue,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";

import React, { useEffect, useState } from "react";
import { introToLoginScreenTransition } from "../context/animationSlice";

import { useVideoPlayer, VideoView } from "expo-video";

const videoSource = require("../assets/trophy_animation.mp4");

const initialState = {
  text1Visible: true,
};

const Intro = ({ navigation }) => {
  const [values, setValues] = useState(initialState);

  // video setup
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.muted = true;
    player.play();
  });

  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(introToLoginScreenTransition());
  //   const timer1 = setTimeout(() => {
  //     setValues({
  //       text1Visible: false,
  //       text2Visible: true,
  //     });
  //   }, 2000);
  //   const timer = setTimeout(() => {
  //     navigation.navigate("Login");
  //   }, 3000);
  //   return () => {
  //     //clearTimeout(timer);
  //     clearTimeout(timer1);
  //     clearTimeout(timer);
  //   };
  // }, []);

  // functions

  const getStartedTapped = () => {
    navigation.navigate("Questionnaire");
  };
  return (
    <View className="bg-black flex-1">
      <View className="bg-black h-full w-full absolute bottom-0 left-0 justify-center items-center">
        {values.text1Visible && (
          // info container
          <View className=" pt-16">
            {/* trophy animation video */}
            <VideoView
              className=" w-full aspect-square"
              player={player}
              allowsFullscreen
              allowsPictureInPicture
              nativeControls={false}
            />

            <View className=" px-8 items-center">
              {/* inspiring title */}
              <View className="w-full mb-8">
                <GradientText
                  text="Achieve"
                  className="text-5xl font-interBold"
                  colors={["#DBD9D9", "#454545"]}
                />
                <GradientText
                  text="Greatness"
                  className="text-5xl font-interBold"
                  colors={["#DBD9D9", "#454545"]}
                />
              </View>

              {/* gradient button */}
              <View className=" mb-5 w-full">
                <GradientButton
                  title="Get started"
                  onPress={getStartedTapped}
                />
              </View>

              <LoginSignupSwitcher
                isLogin={true}
                onPress={() => console.log("test")}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Intro;
