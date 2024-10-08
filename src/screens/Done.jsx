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
    setTimeout(() => {
      dispatch(doneToHomeScreenTransition());
      navigation.navigate("Home");
    }, 1000);
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
          <AnimatedHeader offsetY={offsetY} title="Summary" delay={150} />
          <Animated.ScrollView
            className="flex-1 bg-black "
            onScroll={scrollHandler}
            keyboardShouldPersistTaps="always"
          >
            <SafeAreaView className="flex-1 bg-black items-center justify-center pt-96">
              <View className="items-center gap-y-52">
                <Animated.View
                  entering={FadeInUp.duration(500).springify()}
                  exiting={FadeOutUp.duration(500).springify()}
                  className="items-center"
                >
                  <Text className="font-interBold text-5xl text-white">
                    {formattedSession}
                  </Text>
                  <Text className="font-interBold text-3xl text-primary">
                    Time Elapsed
                  </Text>
                </Animated.View>
                <Pressable onPress={finishButtonPressed}>
                  <Text className="font-interSemiBold text-white">
                    Tap anywhere to finish
                  </Text>
                </Pressable>
              </View>
            </SafeAreaView>
          </Animated.ScrollView>
        </>
      )}
    </View>
  );
};

export default Done;
