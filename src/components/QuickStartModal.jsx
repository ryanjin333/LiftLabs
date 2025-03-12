import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { BlurView } from "expo-blur";
import FocusStartButton from "./FocusStartButton";
import { useSelector, useDispatch } from "react-redux";

import Animated, {
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
import { WorkoutHelpers } from "../helpers/general";
import { useWorkoutInfo, useWorkoutTitle } from "../hooks";
import { changeCurrentWorkout } from "../context/exerciseSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NavigateToUserButton from "./NavigateToUserButton";

const QuickStartModal = ({ selectedDate }) => {
  // get current workout title
  const dispatch = useDispatch();
  const workoutTitle = useWorkoutTitle(selectedDate);
  const workoutInfo = useWorkoutInfo(selectedDate);
  useEffect(() => {
    if (workoutInfo) {
      dispatch(changeCurrentWorkout(workoutInfo));
    }
  }, [workoutInfo]);

  // insets
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      className={` z-50 h-20 w-full items-center `}
      // style={{
      //   shadowColor: "#323232",
      //   borderRadius: 9999,
      //   shadowOffset: { width: 5, height: 5 },
      //   shadowOpacity: 0.4,
      //   shadowRadius: 20,
      //   elevation: 20, // for Android
      // }}
      entering={FadeInDown.duration(500).springify()}
      exiting={FadeOutDown.delay(200).duration(500).springify()}
    >
      <View
        className="w-full h-full rounded-full overflow-hidden "
        // style={{
        //   borderWidth: 1,
        //   borderColor: "#282828",
        // }}
      >
        <BlurView
          intensity={0}
          tint="dark"
          className="h-full w-full flex-row items-center px-8 pr-2 justify-between"
        >
          <View>
            <Text className="text-white font-interSemiBold text-base">
              {workoutTitle == "Go to user"
                ? "Setup schedule  🔧"
                : "Quick Start⚡"}
            </Text>
            <Text className="text-[#797979] font-interMedium text-sm">
              {`${workoutTitle} ${workoutTitle !== "Go to user" ? "day" : ""}`}
            </Text>
          </View>
          {workoutTitle === "Go to user" ? (
            <NavigateToUserButton size="sm" />
          ) : (
            workoutTitle !== "Rest" && <FocusStartButton size="sm" />
          )}
        </BlurView>
      </View>
    </Animated.View>
  );
};

export default QuickStartModal;
