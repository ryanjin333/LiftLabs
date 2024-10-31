import {
  View,
  Text,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { fetchWorkouts, changeModalVisible } from "../context/workoutSlice";
import { addAllExercisesToFirestore } from "../context/exerciseSlice";

import { GoogleGenerativeAI } from "@google/generative-ai";

import axios from "axios";

// AI imports
import OpenAI from "openai";

// Firebase imports
import { auth, db } from "../config/firebase";
import { doc, onSnapshot, getDoc, setDoc, updateDoc } from "firebase/firestore";

// custom imports
import {
  WorkoutRow,
  OutlineButton,
  AddWorkoutModal,
  Dropdown,
  AnimatedHeader,
  WeekCalendar,
} from "../components";

// reanimated imports
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
import { useScrollOffset } from "../hooks";

const Home = () => {
  // initial load

  // useEffect(() => {
  //   dispatch(addAllExercisesToFirestore()); // fetch exercises
  // }, []);

  // redux
  const dispatch = useDispatch();
  const workout = useSelector((state) => state.workout);
  const homeScreenVisible = useSelector(
    (state) => state.animation.homeScreenVisible
  );
  const selectedDate = useSelector((state) => state.calendar.selectedDate);

  // calendar config

  // header animations
  const { offsetY, scrollHandler } = useScrollOffset();

  return (
    <View className="w-full h-full bg-black">
      {homeScreenVisible && (
        <>
          <AnimatedHeader offsetY={offsetY} title="Workouts" delay={150} />
          <Animated.ScrollView
            className="flex-1 bg-black"
            onScroll={scrollHandler}
            keyboardShouldPersistTaps="always"
          >
            <View className="h-24" />
            <SafeAreaView className="flex-1 bg-black px-6 pb-32 items-center">
              <View className="w-full items-start px-2 ">
                <Text className="text-white font-interBold">
                  {selectedDate}
                </Text>
              </View>

              <WeekCalendar />
              {/* button bar */}
              <View className="w-full flex-row justify-between mt-6 z-10">
                <Animated.View
                  entering={FadeInUp.delay(50).duration(500).springify()}
                  exiting={FadeOutUp.delay(100).duration(500).springify()}
                >
                  <Dropdown />
                </Animated.View>
                <Animated.View
                  entering={FadeInUp.delay(100).duration(500).springify()}
                  exiting={FadeOutUp.delay(50).duration(500).springify()}
                >
                  <OutlineButton
                    title="+ Add"
                    onPress={() => dispatch(changeModalVisible(true))}
                  />
                </Animated.View>
              </View>
              <View className="w-full h-full">
                <Animated.View
                  className="w-full"
                  entering={FadeInLeft.delay(150).duration(500).springify()}
                  exiting={FadeOutLeft.duration(500).springify()}
                >
                  {/* no workouts */}
                  {workout.workouts.length == 0 ? (
                    <View className="flex-1 items-center mt-20">
                      <Text className="text-center text-white w-44 font-inter">
                        Tap <Text className="font-interBold">Add</Text> to
                        create a new workout
                      </Text>
                    </View>
                  ) : // shared workouts when theres nothing shared
                  workout.dropdownTitle == "Shared" &&
                    workout.sharedWorkouts.length == 0 ? (
                    <View className="flex-1 items-center mt-20">
                      <Text className="text-center text-white w-44 font-inter">
                        {"Shared workouts will appear here :)"}
                      </Text>
                    </View>
                  ) : (
                    // when there are workouts
                    <View className="w-full mt-7">
                      <FlatList
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                        data={
                          workout.dropdownTitle === "All"
                            ? [...workout.workouts, ...workout.sharedWorkouts]
                            : workout.dropdownTitle === "Shared"
                            ? workout.sharedWorkouts
                            : workout.workouts
                        }
                        renderItem={({ item }) => (
                          <WorkoutRow currentWorkout={item} />
                        )}
                        keyExtractor={(item) =>
                          `${item.id}-${workout.dropdownTitle}`
                        }
                      />
                    </View>
                  )}
                </Animated.View>
              </View>
              <AddWorkoutModal />
            </SafeAreaView>
          </Animated.ScrollView>
        </>
      )}
    </View>
  );
};

export default Home;
