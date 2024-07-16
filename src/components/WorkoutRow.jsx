import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { changeCurrentWorkout } from "../context/exerciseSlice";
import { addWorkout, deleteWorkout } from "../context/workoutSlice";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const WorkoutRow = ({ currentWorkout, isNotification = false }) => {
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

  // get creators username
  // const [creatorUsername, setCreatorUsername] = useState("");
  // useEffect(() => {
  //   setCreatorUsername(dispatch(getUsername(createdBy)));
  // }, []);

  return (
    <AnimatedPressable
      style={animatedStyle}
      className="w-full h-20 bg-[#151515] flex-row rounded-[18px] pl-2 pr-6 items-center justify-between mb-3.5"
      onPress={() => {
        navigation.navigate("Workout", { title, plan });
        dispatch(changeCurrentWorkout(currentWorkout));
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View className="flex-row">
        <Image
          className="h-16 w-16 rounded-[18px] overflow-hidden my-2 mr-6 bg-primary"
          source={
            typeof image == "string"
              ? require("../assets/React_Native_Logo.png")
              : image
          }
        />
        <View className="justify-between py-2">
          <Text
            className="text-white  w-32 text-base font-interSemiBold"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text className="text-[#848484] text-xs font-interSemiBold">
            {plan.length} Exercise{plan.length == 1 ? "" : "s"}
          </Text>
        </View>
      </View>
      {isNotification && (
        <View className="flex-row space-x-6 z-10">
          <Pressable
            className="h-10 w-10 justify-center items-center"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
              dispatch(addWorkout(currentWorkout));
            }}
          >
            <Image className="h-5 w-5" source={require("../assets/yes.png")} />
          </Pressable>
          <Pressable
            className="h-10 w-10 justify-center items-center"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
              dispatch(deleteWorkout(currentWorkout));
            }}
          >
            <Image className="h-5 w-5" source={require("../assets/no.png")} />
          </Pressable>
        </View>
      )}
    </AnimatedPressable>
  );
};

export default WorkoutRow;
