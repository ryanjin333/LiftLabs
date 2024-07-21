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
  withRepeat,
} from "react-native-reanimated";

import { Image as LoadingImage } from "@rneui/themed";

import WorkoutRowDropdown from "./WorkoutRowDropdown";

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

  const loadingOpacity = useSharedValue(1);
  useEffect(() => {
    loadingOpacity.value = withRepeat(
      withTiming(0.6, { duration: 700 }),
      -1,
      true
    );
  }, []);

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
        {/* optional image */}
        <LoadingImage
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            overflow: "hidden",
            marginVertical: 8,
            marginRight: 24,
          }}
          source={
            typeof image == "string"
              ? require("../assets/React_Native_Logo.png")
              : image
          }
          PlaceholderContent={
            <Animated.View
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                overflow: "hidden",
                backgroundColor: "#2b2b2b",
                opacity: loadingOpacity,
              }}
            />
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
      {isNotification ? (
        <View className="flex-row space-x-6">
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
              dispatch(
                deleteWorkout({
                  workout: currentWorkout,
                  type: "pendingWorkouts",
                })
              );
            }}
          >
            <Image className="h-5 w-5" source={require("../assets/no.png")} />
          </Pressable>
        </View>
      ) : (
        <WorkoutRowDropdown currentWorkout={currentWorkout} />
      )}
    </AnimatedPressable>
  );
};

export default WorkoutRow;
