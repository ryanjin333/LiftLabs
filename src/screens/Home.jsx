import { View, Text, FlatList, Image, Modal, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { fetchWorkouts, changeModalVisible } from "../context/workoutSlice";

// Firebase imports
import { auth, db } from "../config/firebase";
import { doc, onSnapshot } from "firebase/firestore";

import {
  WorkoutRow,
  OutlineButton,
  AddWorkoutModal,
  Dropdown,
} from "../components";

const Home = () => {
  // redux
  const dispatch = useDispatch();
  const workout = useSelector((state) => state.workout);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "users", auth.currentUser.uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          dispatch(fetchWorkouts(docSnapshot.data()));
        }
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

  // fonts
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaView className="flex-1 bg-black px-6 pb-32 items-center">
      <View className="w-full items-start mt-16">
        {/* title */}
        <Text
          className="text-white text-4xl"
          style={{ fontFamily: "Inter_700Bold" }}
        >
          Workouts
        </Text>
      </View>
      {/* button bar */}
      <View className="w-full flex-row justify-between mt-6 z-10">
        <Dropdown />
        <OutlineButton
          title="+ Add"
          onPress={() => dispatch(changeModalVisible(true))}
        />
      </View>
      {workout.workouts.length == 0 ? (
        <View className="flex-1 justify-center">
          <Text
            className="text-center text-white w-44"
            style={{ fontFamily: "Inter_600SemiBold" }}
          >
            Tap Add to create a new workout
          </Text>
        </View>
      ) : (
        <View className="w-full mt-7">
          <FlatList
            showsVerticalScrollIndicator={false}
            data={
              workout.dropdownTitle === "All"
                ? [...workout.workouts, ...workout.sharedWorkouts]
                : workout.dropdownTitle === "Shared"
                ? workout.sharedWorkouts
                : workout.workouts
            }
            renderItem={({ item }) => <WorkoutRow currentWorkout={item} />}
            keyExtractor={(item) => `${item.id}-${workout.dropdownTitle}`}
          />
        </View>
      )}
      <AddWorkoutModal />
    </SafeAreaView>
  );
};

export default Home;
