import { View, Text } from "react-native";
import { IntroScene } from "../scene";
import { LoginSignupSwitcher } from "../components";
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

const initialState = {
  text1Visible: true,
  text2Visible: false,
};

const Intro = ({ navigation }) => {
  const [values, setValues] = useState(initialState);
  // useEffect(() => {
  //   const transitionTime = 2000;
  //   const timer1 = setTimeout(() => {
  //     setValues({
  //       text1Visible: false,
  //       text2Visible: true,
  //     });
  //   }, transitionTime); // 2 seconds delay for first transition

  //   // Cleanup timers when the component unmounts
  //   return () => {
  //     clearTimeout(timer1);
  //   };
  // }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(introToLoginScreenTransition());
    const timer1 = setTimeout(() => {
      setValues({
        text1Visible: false,
        text2Visible: true,
      });
    }, 2000);
    // const timer = setTimeout(() => {
    //   navigation.navigate("Login");
    // }, 3000);
    return () => {
      //clearTimeout(timer);
      clearTimeout(timer1);
    };
  }, []);
  return (
    <View className="bg-black flex-1">
      <View
        className="bg-black h-full w-full absolute bottom-0 left-0 justify-center items-center"
        position={[0, 0, 0]}
      >
        {values.text1Visible && (
          <Animated.Text
            className="text-4xl font-interBold text-white text-center"
            entering={FadeIn.delay(500).duration(1500).springify()}
            exiting={FadeOut.duration(1500).springify()}
          >
            Welcome to LiftLabs
          </Animated.Text>
        )}

        {/* {values.text2Visible && (
          <View className="gap-y-96 items-center">
            <Animated.Text
              className="text-4xl font-interBold text-white text-center"
              entering={FadeIn.delay(3000).duration(1500).springify()}
              exiting={FadeOut.duration(1500).springify()}
            >
              Touch the dumbbell to get started
            </Animated.Text>
            <Animated.View
              entering={FadeIn.delay(1500).duration(1500).springify()}
              exiting={FadeOut.duration(1500).springify()}
            ></Animated.View>
          </View>
        )} */}
      </View>
      {values.text2Visible && <IntroScene />}
    </View>
  );
};

export default Intro;
