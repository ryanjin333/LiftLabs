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

import axios from "axios";

// Firebase imports
import { auth, db } from "../config/firebase";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";

// custom imports
import {
  WorkoutRow,
  OutlineButton,
  AddWorkoutModal,
  Dropdown,
  AnimatedHeader,
} from "../components";

// reanimated imports
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
  useSharedValue,
  useAnimatedScrollHandler,
  useDerivedValue,
} from "react-native-reanimated";

const Home = () => {
  // initial load

  // useEffect(() => {
  //   dispatch(addAllExercisesToFirestore()); // fetch exercises
  // }, []);

  useEffect(() => {
    const updateExerciseRankWithAI = async () => {
      try {
        const exerciseRef = doc(db, "exercises", "allExercises");
        const exerciseSnap = await getDoc(exerciseRef);
        if (exerciseSnap.exists()) {
          const exercises = exerciseSnap.data().exercises;
          //console.log(exercises);
          // Step 2: Send exercises to ChatGPT API to rank them
          const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-4",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a trainer that sorts various exercises based on relevance.",
                },
                {
                  role: "user",
                  content: `Please sort the following exercises from most to least relevant, make sure that the format of the output is still the same as the input: ${JSON.stringify(
                    exercises
                  )}`,
                },
              ],
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer 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`, // Replace with your OpenAI API key
              },
            }
          );

          const sortedExercises = response.data.choices[0].message.content;
          console.log(JSON.parse(sortedExercises));

          // Step 3: Update Firestore with the sorted exercises
          // await updateDoc(exerciseRef, {
          //   exercises: JSON.parse(sortedExercises), // Update with the new sorted data
          // });

          console.log("Exercises updated successfully!");
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    };
    updateExerciseRankWithAI();
  }, []);

  // redux
  const dispatch = useDispatch();
  const workout = useSelector((state) => state.workout);
  const homeScreenVisible = useSelector(
    (state) => state.animation.homeScreenVisible
  );

  // animations
  const offsetY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    offsetY.value = event.contentOffset.y;
  });

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
                  entering={FadeInUp.delay(150).duration(500).springify()}
                  exiting={FadeOutUp.duration(500).springify()}
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
