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

const Done = ({ navigation }) => {
  // initial load
  useEffect(() => {
    setTimeout(() => {
      dispatch(doneToHomeScreenTransition());
      navigation.navigate("Home");
    }, 850); // however long the animation is
  }, []);

  const dispatch = useDispatch();
  const doneScreenVisible = useSelector(
    (state) => state.animation.doneScreenVisible
  );

  return (
    <View className="w-full h-full bg-black">
      {doneScreenVisible && (
        <SafeAreaView className="flex-1 bg-black px-6 pb-32 items-center justify-center">
          <Text className="text-white text-3xl">hi</Text>
        </SafeAreaView>
      )}
    </View>
  );
};

export default Done;
