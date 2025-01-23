import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import * as Haptics from "expo-haptics";

import { useNavigation } from "@react-navigation/native";

import { LinearGradient } from "expo-linear-gradient";

import { useDispatch, useSelector } from "react-redux";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { showMessage } from "react-native-flash-message";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GradientButton = ({ size = "base" }) => {
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

  // TODO: NAVIGATE TO COUNTDOWN SCREEN BEFORE TRANSITION
  const buttonPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    console.log("hi");
  };
  return (
    <AnimatedPressable
      style={animatedStyle}
      className={`rounded-full h-16 w-60 justify-center items-center`}
      onPress={buttonPressed}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Shadow view for button */}
      <View
        className="w-full h-full justify-center items-center rounded-full"
        style={{
          borderRadius: 9999,
          shadowColor: "#ffffff",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.6,
          shadowRadius: 25,
          elevation: 25, // For Android
        }}
      >
        <LinearGradient
          // Button Linear Gradient
          colors={["#ffffff", "#909090"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-full h-full justify-center items-center rounded-full"
        >
          <Text className=" font-interSemiBold text-lg">Generate</Text>
        </LinearGradient>
      </View>
    </AnimatedPressable>
  );
};

export default GradientButton;
