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

import Animated, {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
  useSharedValue,
  useScrollViewOffset,
  useAnimatedRef,
  useDerivedValue,
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

const Focus = ({ navigation }) => {
  // redux
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const currentWorkout = useSelector((state) => state.exercise.currentWorkout);

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
  return (
    <FlatList
      className="bg-black"
      data={fullPlan}
      keyExtractor={(item) => item.uniqueId}
      renderItem={({ item }) => (
        // actual screen
        <SafeAreaView className="h-screen w-screen p-6 bg-black justify-between items-center">
          <View className="w-full">
            {/* main title and exit button */}
            <View className="flex-row justify-between mb-10">
              {/* title  */}
              <Text className="w-72 text-primary font-interBold text-3xl ml-6">
                {item.title}
              </Text>
              {/* exit button */}
              <Pressable
                className="w-11 h-11 flex justify-start items-end "
                onPress={() => navigation.goBack()}
              >
                <Image
                  className="h-6 w-6"
                  source={require("../assets/exit.png")}
                />
              </Pressable>
            </View>
            {/* exercise weight */}
            <Text className=" text-primary font-interBold text-3xl mx-6 mb-6">
              {item.weight}
              <Text className="text-white font-interMedium text-2xl">
                {` ${user.weight}`}
              </Text>
            </Text>
            {/* gif */}
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

            {/* other information */}
            {/* exercise set */}
            <View className="px-6 w-full flex-row mt-10 justify-between">
              <Text className=" text-primary font-interBold text-3xl ">
                {item.set + " "}
                of
                {" " + item.sets}
                <Text className="text-white font-interMedium text-2xl">
                  {" "}
                  sets
                </Text>
              </Text>

              <Text className=" text-white font-interBold text-3xl ">·</Text>

              {/* exercise reps */}
              <Text className="text-primary  font-interBold text-3xl">
                {item.reps}
                <Text className="text-white font-interMedium text-2xl">
                  {" "}
                  reps
                </Text>
              </Text>
            </View>
          </View>
          {/* swipe down message (only show on first screen)*/}
          {fullPlan[0].uniqueId == item.uniqueId && (
            <View className="items-center mb-3">
              <Text className=" text-white font-interMedium ">
                scroll down to continue
              </Text>
              <AnimatedImage
                className="h-7 w-7"
                style={animatedStyle}
                source={require("../assets/chevron_down.png")}
              />
            </View>
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
