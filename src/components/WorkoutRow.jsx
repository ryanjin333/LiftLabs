import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { changeCurrentWorkout } from "../context/exerciseSlice";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const WorkoutRow = ({ currentWorkout }) => {
  // navigation
  const navigation = useNavigation();

  // props
  const { title, image, plan, createdBy } = currentWorkout;

  // animations
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.85, {
      damping: 50,
      stiffness: 100,
    });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 50, stiffness: 100 });
  };

  // redux
  const dispatch = useDispatch();
  return (
    <AnimatedPressable
      style={animatedStyle}
      className="w-full h-20 bg-[#151515] flex-row rounded-[18px] items-center mb-3.5"
      onPress={() => {
        navigation.navigate("Workout", { title, plan });
        dispatch(changeCurrentWorkout(currentWorkout));
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Image
        className="h-16 w-16 rounded-[18px] overflow-hidden ml-2 mr-6"
        source={
          typeof image == "string"
            ? require("../assets/React_Native_Logo.png")
            : image
        }
      />
      <View className="">
        <Text className="text-white mb-5 text-base font-interSemiBold">
          {title}
        </Text>
        <Text className="text-[#848484] text-xs font-interSemiBold">
          {plan.length} Exercise{plan.length == 1 ? "" : "s"}
        </Text>
      </View>
    </AnimatedPressable>
  );
};

export default WorkoutRow;
