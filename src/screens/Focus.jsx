import {
  View,
  Text,
  Dimensions,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import React, { useEffect, useState, useRef } from "react";
import { AnimatedStopwatchTimer, GradientText } from "../components";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeInLeft,
  FadeOutLeft,
  FadeOutUp,
  FadeOutDown,
} from "react-native-reanimated";

import { Image as RNEImage } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import {
  focusToDoneScreenTransition,
  focusToWorkoutScreenTransition,
} from "../context/animationSlice";
import {
  useBouncingAnimation,
  useFullPlan,
  useStopwatchInterval,
  useLoadingOpacity,
  useHasNotch,
} from "../hooks";
import { LinearGradient } from "expo-linear-gradient";

const Focus = ({ navigation }) => {
  // Redux
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const currentWorkout = useSelector((state) => state.exercise.currentWorkout);
  const focusScreenVisible = useSelector(
    (state) => state.animation.focusScreenVisible
  );

  // Timer
  const stopwatchTimerRef = useStopwatchInterval();

  // Positioning
  const insets = useSafeAreaInsets();

  // Create full workout plan
  const fullPlan = useFullPlan(currentWorkout);
  const [displayedPlan, setDisplayedPlan] = useState([]);

  useEffect(() => {
    if (!Array.isArray(fullPlan)) return; // Prevent crashes if fullPlan is not an array

    let newPlan = [];
    fullPlan.forEach((item, index) => {
      newPlan.push(item);
      if (index < fullPlan.length - 1) {
        newPlan.push({ type: "break", uniqueId: `break-${index}` });
      }
    });

    setDisplayedPlan(newPlan);
  }, [fullPlan]);

  // Handle end of workout
  const endOfWorkoutReached = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    stopwatchTimerRef.current?.resetTimer();
    dispatch(focusToDoneScreenTransition());
    const session = stopwatchTimerRef.current?.getTime();

    setTimeout(() => {
      navigation.navigate("Done", { session });
    }, 850);
  };

  // Render item function
  const renderItem = ({ item }) => {
    if (item.type === "break") {
      return (
        <SafeAreaView className="h-screen w-screen bg-black items-center justify-center">
          <View className="w-full justify-between items-center h-80">
            <View className="items-center">
              <GradientText
                text="1:28"
                className="text-8xl font-interBold"
                orientation="vertical"
                colors={["#e2e2e2", "#3d3d3d"]}
              />
              <View className=" px-4 py-2 border border-[#8d8d8d] rounded-full">
                <Text className="text-white font-interSemiBold">Break</Text>
              </View>
            </View>
            <Pressable onPress={() => console.log("hi")}>
              <LinearGradient
                colors={["#3d3d3d", "#1b1b1b"]} // Customize gradient colors
                locations={[0, 0.2]}
                start={[0, 0]}
                end={[0, 1]} // Top to bottom gradient
                className="rounded-[20px] m-0.5 p-[1px]"
              >
                <View
                  key={item}
                  className="rounded-[20px] bg-[#181818] justify-center items-center p-4 w-32 h-20" // Transparent border to retain gradient
                >
                  <Image
                    className="h-10 w-10 "
                    source={require("../assets/pause_white.png")}
                  />
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView className="h-screen w-screen bg-black items-center">
        <View
          className="absolute top-0 left-0 w-full bg-white"
          style={{ height: insets.top }}
        />
        <View className="w-full items-end">
          {/* Header spacing */}
          <View className="h-16 w-full bg-white" />

          {/* Exercise GIF */}
          <Animated.View
            entering={FadeInLeft.delay(200).duration(500).springify()}
            exiting={FadeOutLeft.delay(150).duration(500).springify()}
            className="overflow-hidden"
          >
            <RNEImage
              style={{
                width: "100%",
                aspectRatio: 1,
                backgroundColor: "transparent",
              }}
              source={{ uri: item.gif }}
              PlaceholderContent={
                <Animated.View
                  style={{
                    width: "100%",
                    aspectRatio: 1,
                    backgroundColor: "#3d3d3d",
                  }}
                />
              }
            />
          </Animated.View>

          {/* Separator */}
          <View className="h-10 w-full bg-white" />

          {/* Exercise Info */}
          <View className="flex-row justify-between w-full mt-3 px-3">
            <Animated.Text
              entering={FadeInUp.delay(50).duration(500).springify()}
              exiting={FadeOutUp.delay(300).duration(500).springify()}
              className="w-56 text-white font-interBold text-xl"
              ellipsizeMode="tail"
              numberOfLines={3}
            >
              {item.title}
            </Animated.Text>

            <Animated.Text
              className="text-white font-interSemiBold text-lg"
              entering={FadeInDown.delay(250).duration(500).springify()}
              exiting={FadeOutDown.delay(100).duration(500).springify()}
            >
              {item.set}/{item.sets}
              <Text className="text-subtitle text-xl font-interMedium">
                {" "}
                sets
              </Text>
            </Animated.Text>
          </View>
        </View>

        {/* Weight & Reps */}
        <View className="flex-1 justify-center">
          <View className="px-10 w-full flex-row justify-between">
            <Animated.Text
              className="text-white font-interSemiBold text-6xl"
              entering={FadeInUp.delay(100).duration(500).springify()}
              exiting={FadeOutUp.delay(250).duration(500).springify()}
            >
              {item.weight}
              <Text className="text-subtitle font-interMedium text-3xl">
                {" "}
                {user.weight}
              </Text>
            </Animated.Text>

            <Animated.Text
              className="text-white font-interSemiBold text-6xl"
              entering={FadeInDown.delay(300).duration(500).springify()}
              exiting={FadeOutDown.delay(50).duration(500).springify()}
            >
              {item.reps}
              <Text className="text-subtitle font-interMedium text-3xl">
                {" "}
                reps
              </Text>
            </Animated.Text>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <>
      {focusScreenVisible && (
        <>
          {/* Timer & Exit Button */}
          <View
            className={`flex-row w-full px-4 mt-${
              useHasNotch() ? "16" : "10"
            } absolute z-50`}
          >
            <Animated.View
              entering={FadeInUp.duration(500).springify()}
              exiting={FadeOutUp.delay(350).duration(500).springify()}
              className="w-full items-end"
            >
              <LinearGradient
                colors={["#3d3d3d", "#1b1b1b"]} // Customize gradient colors
                locations={[0, 0.5]}
                start={[0, 0]}
                end={[0, 1]} // Top to bottom gradient
                className="rounded-full m-0.5 p-[1px]"
              >
                <Pressable
                  className="w-24 h-10 flex-row justify-between px-4 items-center rounded-full bg-[#292929]"
                  onPress={() => {
                    dispatch(focusToWorkoutScreenTransition());
                    stopwatchTimerRef.current?.resetTimer();
                    setTimeout(() => navigation.navigate("Home"), 850);
                  }}
                >
                  <AnimatedStopwatchTimer ref={stopwatchTimerRef} />
                  <Image
                    className="w-4 h-4"
                    source={require("../assets/exit.png")}
                  />
                </Pressable>
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Workout List with Breaks */}
          <Animated.FlatList
            className="bg-black z-10"
            data={displayedPlan}
            keyExtractor={(item) => item.uniqueId}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            snapToInterval={Dimensions.get("window").height - 0.1}
            decelerationRate="fast"
            onEndReachedThreshold={0}
            onEndReached={endOfWorkoutReached}
            showsHorizontalScrollIndicator={false}
          />
        </>
      )}
    </>
  );
};

export default Focus;
