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
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

import { useSelector, useDispatch } from "react-redux";

import {
  WorkoutRow,
  OutlineButton,
  AddWorkoutModal,
  Dropdown,
} from "../components";

const Home = () => {
  const [workouts, setWorkouts] = useState([]);
  const user = useSelector((state) => state.user);
  const workoutRef = doc(db, "users", user.uid);
  useEffect(() => {
    (async function () {
      try {
        const workoutsSnap = await getDoc(workoutRef);
        if (workoutsSnap.exists()) {
          setWorkouts(workoutsSnap.data().workouts);
        } else {
          console.log("Cannot find document for uid:", user.uid);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [workoutRef]);

  const [modalVisible, setModalVisible] = useState(false);

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
    <SafeAreaView className="flex-1 bg-black px-6 items-center">
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
        <OutlineButton title="+ Add" onPress={() => setModalVisible(true)} />
      </View>

      <FlatList
        className="w-full mt-7"
        data={workouts}
        renderItem={({ item }) => (
          <WorkoutRow
            title={item.title}
            image={item.image}
            plan={item.plan}
            createdBy={item.createdBy}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <AddWorkoutModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        workouts={workouts}
        setWorkouts={setWorkouts}
      />
    </SafeAreaView>
  );
};

export default Home;
