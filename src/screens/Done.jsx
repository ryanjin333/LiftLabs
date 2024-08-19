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
    }, 1000); // however long the animation is
  }, []);

  const dispatch = useDispatch();
  const doneScreenVisible = useSelector(
    (state) => state.animation.doneScreenVisible
  );

  useEffect(() => {
    console.log(doneScreenVisible);
  }, [doneScreenVisible]);

  return (
    <View className="w-full h-full bg-black">
      {doneScreenVisible && (
        <SafeAreaView className="flex-1 bg-black items-center justify-center">
          <View>
            <Animated.View
              entering={FadeInUp.duration(500).springify()}
              exiting={FadeOutUp.duration(500).springify()}
            >
              <Image
                className="h-20 w-20 "
                source={require("../assets/done.png")}
              />
            </Animated.View>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

export default Done;
