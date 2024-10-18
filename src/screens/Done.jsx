import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  Pressable,
  Image,
} from "react-native";

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
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { doneToHomeScreenTransition } from "../context/animationSlice";
import { AnimatedHeader } from "../components";

const Done = ({ navigation, route }) => {
  // initial load
  const { session } = route.params;

  // time needs to be converted
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
  };
  const formattedSession = formatTime(session);

  const finishButtonPressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    dispatch(doneToHomeScreenTransition());
    setTimeout(() => {
      navigation.navigate("Home");
    }, 600);
  };

  const dispatch = useDispatch();
  const doneScreenVisible = useSelector(
    (state) => state.animation.doneScreenVisible
  );

  // animations
  const offsetY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    offsetY.value = event.contentOffset.y;
  });

  return (
    <View className="w-full h-full bg-black">
      {doneScreenVisible && (
        <>
          {/* summary header */}
          <AnimatedHeader
            offsetY={offsetY}
            title="Summary"
            delay={100}
            className="z-10"
          />
          <Animated.ScrollView
            className="flex-1 bg-black "
            onScroll={scrollHandler}
            keyboardShouldPersistTaps="always"
          >
            <SafeAreaView className="flex-1 bg-black items-center justify-center pt-96">
              {/* time elapsed view */}
              <View className="items-center gap-y-52">
                <Animated.View
                  entering={FadeInLeft.duration(500).delay(50).springify()}
                  exiting={FadeOutLeft.duration(500).delay(50).springify()}
                  className="items-center"
                >
                  <Text className="font-interBold text-5xl text-white">
                    {formattedSession}
                  </Text>
                  <Text className="font-interBold text-3xl text-primary">
                    Time Elapsed
                  </Text>
                </Animated.View>
                <View>
                  <Animated.Text
                    className="font-interSemiBold text-white"
                    entering={FadeInDown.duration(500).delay(100).springify()}
                    exiting={FadeOutDown.duration(500).springify()}
                  >
                    Tap anywhere to finish
                  </Animated.Text>
                </View>
              </View>
            </SafeAreaView>
          </Animated.ScrollView>
          {/* button to return to home screen */}
          <Pressable
            className="top-0 left-0 right-0 bottom-0 absolute z-20"
            onPress={finishButtonPressed}
          />
        </>
      )}
    </View>
  );
};

export default Done;
