import {
  View,
  Text,
  Dimensions,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";

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

const AnimatedImage = Animated.createAnimatedComponent(Image);
//const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedRNEImage = Animated.createAnimatedComponent(RNEImage);

import { Image as RNEImage } from "@rneui/themed";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import { focusToWorkoutScreenTransition } from "../context/animationSlice";

const Focus = ({ navigation }) => {
  // redux
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const currentWorkout = useSelector((state) => state.exercise.currentWorkout);
  const focusScreenVisible = useSelector(
    (state) => state.animation.focusScreenVisible
  );

  const [fullPlan, setFullPlan] = useState({});
  useEffect(() => {
    const fullPlanAlgorithm = currentWorkout.plan.flatMap((exercise) => {
      // Create an array of sets for each exercise
      return Array.from(
        { length: parseInt(exercise.sets, 10) },
        (_, index) => ({
          ...exercise,
          set: index + 1,
          uniqueId: `${exercise.id}-${index + 1}`,
        })
      );
    });
    setFullPlan(fullPlanAlgorithm);
  }, []);

  // loading animations for gif images
  const loadingOpacity = useSharedValue(1);
  useEffect(() => {
    loadingOpacity.value = withRepeat(
      withTiming(0.6, { duration: 700 }),
      -1,
      true
    );
  }, []);

  // animations for swipe down image
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 700 }),
        withTiming(0, { duration: 700 }),
        withTiming(8, { duration: 700 }),
        withTiming(0, { duration: 700 }), // repeat twice before stopping briefly
        withTiming(0, { duration: 1400 })
      ),
      -1, // Infinite repeat
      false // No reverse
    );
  }, [translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // trigger when scrolled past the bottom
  const offsetY = useSharedValue(0);
  const deviceHeight = Dimensions.get("window").height;

  const scrollHandler = useAnimatedScrollHandler((event) => {
    offsetY.value = event.contentOffset.y;
    const totalHeight = event.contentSize.height;
    if (offsetY.value > totalHeight - deviceHeight + 50) {
      // NAVIGATE TO DONE HERE
      //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    }
  });
  return (
    <Animated.FlatList
      className="bg-black"
      data={fullPlan}
      keyExtractor={(item) => item.uniqueId}
      onScroll={scrollHandler}
      renderItem={({ item }) => (
        // actual screen
        <SafeAreaView className="h-screen w-screen px-6 py-3 bg-black justify-between items-center">
          {/* add animations here */}
          {focusScreenVisible && (
            <>
              <View className="w-full items-end">
                {/* main title and exit button */}
                {/* exit button */}
                <Animated.View
                  entering={FadeInUp.duration(1000).springify()}
                  exiting={FadeOutUp.delay(100).duration(1000).springify()}
                >
                  <Pressable
                    className="w-10 h-10 flex justify-center items-center rounded-full bg-[#292929]"
                    onPress={() => {
                      dispatch(focusToWorkoutScreenTransition());
                      setTimeout(() => {
                        navigation.goBack();
                      }, 1000);
                    }}
                  >
                    <Image
                      className="h-5 w-5"
                      source={require("../assets/exit.png")}
                    />
                  </Pressable>
                </Animated.View>

                <View className="flex-row justify-between mb-10 w-full mt-3 px-3">
                  {/* title  */}
                  <AnimatedText
                    entering={FadeInUp.delay(100).duration(1000).springify()}
                    exiting={FadeOutUp.delay(100).duration(1000).springify()}
                    className="w-56 text-primary font-interBold text-3xl"
                    ellipsizeMode="tail"
                    numberOfLines={3}
                  >
                    {item.title}
                  </AnimatedText>
                  {/* exercise weight */}
                  <AnimatedText
                    className=" text-primary font-interBold text-3xl "
                    entering={FadeInUp.delay(200).duration(1000).springify()}
                    exiting={FadeOutUp.delay(100).duration(1000).springify()}
                  >
                    {item.weight}
                    <AnimatedText
                      className="text-white font-interMedium text-2xl"
                      entering={FadeInUp.delay(300).duration(1000).springify()}
                      exiting={FadeOutUp.delay(100).duration(1000).springify()}
                    >
                      {` ${user.weight}`}
                    </AnimatedText>
                  </AnimatedText>
                </View>

                {/* gif */}
                <Animated.View
                  entering={FadeInUp.delay(400).duration(1000).springify()}
                  exiting={FadeOutUp.delay(100).duration(1000).springify()}
                >
                  <RNEImage
                    style={{
                      width: "100%",
                      aspectRatio: 1,
                      borderRadius: 40,
                      overflow: "hidden",
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
                  <AnimatedText
                    className=" text-primary font-interBold text-3xl "
                    entering={FadeInUp.delay(500).duration(1000).springify()}
                    exiting={FadeOutUp.delay(100).duration(1000).springify()}
                  >
                    {item.set + " "}
                    of
                    {" " + item.sets}
                    <Text className="text-white font-interMedium text-2xl">
                      {" "}
                      sets
                    </Text>
                  </AnimatedText>

                  {/* exercise reps */}
                  <AnimatedText
                    className="text-primary  font-interBold text-3xl"
                    entering={FadeInUp.delay(600).duration(1000).springify()}
                    exiting={FadeOutUp.delay(100).duration(1000).springify()}
                  >
                    {item.reps}
                    <Text className="text-white font-interMedium text-2xl">
                      {" "}
                      reps
                    </Text>
                  </AnimatedText>
                </View>
              </View>
              {/* swipe down message (only show on first screen)*/}
              {fullPlan[0].uniqueId == item.uniqueId && (
                <Animated.View className="items-center mb-3">
                  <Text
                    className=" text-white font-interMedium "
                    entering={FadeInUp.delay(700).duration(1000).springify()}
                    exiting={FadeOutUp.delay(100).duration(1000).springify()}
                  >
                    scroll down to continue
                  </Text>
                  <AnimatedImage
                    className="h-7 w-7"
                    style={animatedStyle}
                    source={require("../assets/chevron_down.png")}
                  />
                </Animated.View>
              )}
            </>
          )}
        </SafeAreaView>
      )}
      snapToInterval={Dimensions.get("window").height}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Focus;
