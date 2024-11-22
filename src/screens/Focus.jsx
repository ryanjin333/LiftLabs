import {
  View,
  Text,
  Dimensions,
  FlatList,
  Pressable,
  Image,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useRef } from "react";
import StopwatchTimer, {
  StopwatchTimerMethods,
} from "react-native-animated-stopwatch-timer";

import * as Haptics from "expo-haptics";

import Animated, {
  FadeInUp,
  FadeInDown,
  FadeInLeft,
  FadeOutLeft,
  FadeOutUp,
  FadeOutDown,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image);

import { Image as RNEImage } from "@rneui/themed";

// redux imports
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
} from "../hooks";

const Focus = ({ navigation }) => {
  // redux
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const currentWorkout = useSelector((state) => state.exercise.currentWorkout);
  const focusScreenVisible = useSelector(
    (state) => state.animation.focusScreenVisible
  );

  // timer
  const stopwatchTimerRef = useStopwatchInterval();

  // iterate through to create a list separated by sets also
  const fullPlan = useFullPlan(currentWorkout);

  // loading animations for gif images
  const loadingOpacity = useLoadingOpacity();

  // animations for swipe down image
  const animatedStyle = useBouncingAnimation();

  // trigger when scrolled past the bottom
  const endOfWorkoutReached = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // update stopwatch
    stopwatchTimerRef.current?.reset();

    dispatch(focusToDoneScreenTransition());
    const session = stopwatchTimerRef.current?.getSnapshot();

    setTimeout(() => {
      navigation.navigate("Done", {
        session: session,
      });
    }, 850);
  };
  return (
    <>
      {focusScreenVisible && (
        <>
          {/* timer and exit button */}
          <View className="flex-row w-full justify-between items-center px-10 pt-20 absolute z-50">
            <Animated.View
              entering={FadeInUp.duration(500).springify()}
              exiting={FadeOutUp.delay(350).duration(500).springify()}
              className="flex-row w-full justify-between items-center"
            >
              {/* timer */}
              <StopwatchTimer
                ref={stopwatchTimerRef}
                textCharStyle={{
                  color: "#fff",
                  fontSize: 48,
                  fontWeight: "bold",
                  letterSpacing: 1,
                }}
                trailingZeros={0}
                renderText={(time) => {
                  // Format the time to include minutes and seconds
                  const minutes = Math.floor(time / 60000)
                    .toString()
                    .padStart(2, "0");
                  const seconds = Math.floor((time % 60000) / 1000)
                    .toString()
                    .padStart(2, "0");
                  return `${minutes}:${seconds}`;
                }}
              />

              {/* exit button */}
              <Pressable
                className="w-10 h-10 flex justify-center items-center rounded-full bg-[#292929]"
                onPress={() => {
                  dispatch(focusToWorkoutScreenTransition());
                  // update stopwatch
                  stopwatchTimerRef.current?.reset();
                  setTimeout(() => {
                    navigation.goBack();
                  }, 850);
                }}
              >
                <Image
                  className="h-5 w-5"
                  source={require("../assets/exit.png")}
                />
              </Pressable>
            </Animated.View>
          </View>
          <Animated.FlatList
            className="bg-black z-10"
            data={fullPlan}
            keyExtractor={(item) => item.uniqueId}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              // actual screen
              <SafeAreaView className="h-screen w-screen px-6 py-3 bg-black justify-between items-center">
                {/* add animations here */}

                <>
                  <View className="w-full items-end">
                    {/* header spacing */}
                    <View className="h-20" />

                    <View className="flex-row justify-between mb-10 w-full mt-3 px-3">
                      {/* title  */}
                      <Animated.Text
                        entering={FadeInUp.delay(50).duration(500).springify()}
                        exiting={FadeOutUp.delay(300).duration(500).springify()}
                        className="w-56 text-primary font-interBold text-3xl"
                        ellipsizeMode="tail"
                        numberOfLines={3}
                      >
                        {item.title}
                      </Animated.Text>
                      {/* exercise weight */}
                      <Animated.Text
                        className=" text-primary font-interBold text-3xl "
                        entering={FadeInUp.delay(100).duration(500).springify()}
                        exiting={FadeOutUp.delay(250).duration(500).springify()}
                      >
                        {item.weight}
                        <Animated.Text
                          className="text-white font-interMedium text-2xl"
                          entering={FadeInUp.delay(150)
                            .duration(500)
                            .springify()}
                          exiting={FadeOutUp.delay(200)
                            .duration(500)
                            .springify()}
                        >
                          {` ${user.weight}`}
                        </Animated.Text>
                      </Animated.Text>
                    </View>

                    {/* gif */}
                    <Animated.View
                      entering={FadeInLeft.delay(200).duration(500).springify()}
                      exiting={FadeOutLeft.delay(150).duration(500).springify()}
                      className="rounded-[30px] overflow-hidden"
                    >
                      <RNEImage
                        style={{
                          width: "100%",
                          aspectRatio: 1,
                          borderRadius: 40,
                          overflow: "hidden",
                          backgroundColor: "transparent",
                        }}
                        source={{ uri: item.gif }}
                        PlaceholderContent={
                          <Animated.View
                            style={{
                              width: "100%",
                              aspectRatio: 1,
                              borderRadius: 12,
                              overflow: "hidden",
                              backgroundColor: "#3d3d3d",
                              opacity: loadingOpacity,
                            }}
                          />
                        }
                      />
                    </Animated.View>

                    {/* other information */}
                    {/* exercise set */}
                    <View className="px-6 w-full flex-row mt-10 justify-between">
                      <Animated.Text
                        className=" text-primary font-interBold text-3xl "
                        entering={FadeInDown.delay(250)
                          .duration(500)
                          .springify()}
                        exiting={FadeOutDown.delay(100)
                          .duration(500)
                          .springify()}
                      >
                        {item.set + " "}
                        of
                        {" " + item.sets}
                        <Text className="text-white font-interMedium text-2xl">
                          {" "}
                          sets
                        </Text>
                      </Animated.Text>

                      {/* exercise reps */}
                      <Animated.Text
                        className="text-primary  font-interBold text-3xl"
                        entering={FadeInDown.delay(300)
                          .duration(500)
                          .springify()}
                        exiting={FadeOutDown.delay(50)
                          .duration(500)
                          .springify()}
                      >
                        {item.reps}
                        <Text className="text-white font-interMedium text-2xl">
                          {" "}
                          reps
                        </Text>
                      </Animated.Text>
                    </View>
                  </View>
                  {/* swipe down message (only show on first and last screen)*/}
                  {(fullPlan[0].uniqueId == item.uniqueId ||
                    fullPlan[fullPlan.length - 1].uniqueId ==
                      item.uniqueId) && (
                    <Animated.View className="items-center ">
                      <Text
                        className=" text-white font-interMedium "
                        entering={FadeInDown.delay(350)
                          .duration(500)
                          .springify()}
                        exiting={FadeOutDown.duration(500).springify()}
                      >
                        {fullPlan[0].uniqueId == item.uniqueId
                          ? "swipe to continue"
                          : "swipe to finish"}
                      </Text>
                      <AnimatedImage
                        className="h-7 w-7"
                        style={animatedStyle}
                        source={require("../assets/chevron_down.png")}
                      />
                    </Animated.View>
                  )}
                </>
              </SafeAreaView>
            )}
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
