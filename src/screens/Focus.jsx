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
import { AnimatedStopwatchTimer, GradientText } from "../components";

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
  useHasNotch,
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

  // checks if phone has notch
  const hasNotch = useHasNotch();

  // trigger when scrolled past the bottom
  const endOfWorkoutReached = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // update stopwatch
    stopwatchTimerRef.current?.resetTimer();

    dispatch(focusToDoneScreenTransition());
    const session = stopwatchTimerRef.current?.getTime();

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
          <View
            className={`flex-row w-full   px-4 mt-${
              hasNotch ? "20" : "10"
            } absolute z-50`}
          >
            <Animated.View
              entering={FadeInUp.duration(500).springify()}
              exiting={FadeOutUp.delay(350).duration(500).springify()}
              className=" w-full  items-end"
            >
              {/* exit button */}
              <Pressable
                className={`w-24 h-10 flex-row justify-between px-4 items-center rounded-full bg-[#292929]`}
                onPress={() => {
                  dispatch(focusToWorkoutScreenTransition());
                  // update stopwatch
                  stopwatchTimerRef.current?.resetTimer();
                  setTimeout(() => {
                    navigation.navigate("Home");
                  }, 850);
                }}
              >
                {/* timer */}
                <AnimatedStopwatchTimer ref={stopwatchTimerRef} />
                <Image
                  className={`w-4 h-4
                  }`}
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
              <>
                <SafeAreaView className="h-screen w-screen  py-3 bg-black items-center">
                  {/* add animations here */}

                  <>
                    <View className="w-full items-end">
                      {/* header spacing */}
                      <View className="h-16 w-full bg-white" />
                      {/* gif */}
                      <Animated.View
                        entering={FadeInLeft.delay(200)
                          .duration(500)
                          .springify()}
                        exiting={FadeOutLeft.delay(150)
                          .duration(500)
                          .springify()}
                        className={` overflow-hidden `}
                      >
                        <RNEImage
                          style={{
                            width: "100%",
                            aspectRatio: 1,

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

                      {/* separator */}
                      <View className="h-10 w-full bg-white" />

                      {/* other information */}

                      <View className="flex-row justify-between w-full mt-3 px-3">
                        {/* title  */}
                        <Animated.Text
                          entering={FadeInUp.delay(50)
                            .duration(500)
                            .springify()}
                          exiting={FadeOutUp.delay(300)
                            .duration(500)
                            .springify()}
                          className={`w-56 text-white font-interBold text-xl
                        }`}
                          ellipsizeMode="tail"
                          numberOfLines={3}
                        >
                          {item.title}
                        </Animated.Text>

                        {/* exercise set */}
                        <Animated.Text
                          className={`text-white font-interSemiBold text-lg`}
                          entering={FadeInDown.delay(250)
                            .duration(500)
                            .springify()}
                          exiting={FadeOutDown.delay(100)
                            .duration(500)
                            .springify()}
                        >
                          {item.set + "/" + item.sets}

                          <Text
                            className={` text-subtitle text-xl font-interMedium`}
                          >
                            {" "}
                            sets
                          </Text>
                        </Animated.Text>
                      </View>
                    </View>
                    <View className=" flex-1 justify-center">
                      <View className={`px-10 w-full flex-row justify-between`}>
                        {/* exercise weight */}
                        <Animated.Text
                          className={`text-white font-interSemiBold text-6xl
                        }`}
                          entering={FadeInUp.delay(100)
                            .duration(500)
                            .springify()}
                          exiting={FadeOutUp.delay(250)
                            .duration(500)
                            .springify()}
                        >
                          {item.weight}
                          <Text
                            className={`text-subtitle font-interMedium text-3xl
                          }`}
                          >
                            {` ${user.weight}`}
                          </Text>
                        </Animated.Text>

                        {/* exercise reps */}
                        <Animated.Text
                          className={`text-white font-interSemiBold text-6xl
                        }`}
                          entering={FadeInDown.delay(300)
                            .duration(500)
                            .springify()}
                          exiting={FadeOutDown.delay(50)
                            .duration(500)
                            .springify()}
                        >
                          {item.reps}
                          <Text
                            className={`text-subtitle font-interMedium text-3xl`}
                          >
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
              </>
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
