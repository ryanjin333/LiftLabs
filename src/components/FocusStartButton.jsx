import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import * as Haptics from "expo-haptics";

import { useNavigation } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { workoutToFocusScreenTransition } from "../context/animationSlice";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FocusStartButton = () => {
  // navigation
  const navigation = useNavigation();

  // redux
  const dispatch = useDispatch();
  const currentWorkout = useSelector((state) => state.exercise.currentWorkout);
  // animations
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.85, { damping: 20, stiffness: 200 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 200 });
  };

  // functions
  const buttonPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    if (currentWorkout.plan.length > 0) {
      dispatch(workoutToFocusScreenTransition());
      setTimeout(() => {
        navigation.navigate("Focus");
      }, 750);
    } else {
      // ADD WARNING UI
      console.log("No workouts");
    }
  };
  return (
    <AnimatedPressable
      style={animatedStyle}
      className="bg-primary rounded-full h-20 w-20 justify-center items-center absolute bottom-16 right-3"
      onPress={buttonPressed}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Image
        style={{ resizeMode: "contain" }}
        source={require("../assets/play_button.png")}
        className="h-8 w-8"
      ></Image>
    </AnimatedPressable>
  );
};

export default FocusStartButton;
