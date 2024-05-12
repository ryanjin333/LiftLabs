import { View, Text, FlatList, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import { changeModalVisible } from "../context/exerciseSlice";

import { ExerciseRow, OutlineButton, AddExerciseModal } from "../components";

const Workout = ({ route, navigation }) => {
  const { title, plan } = route.params;

  //redux
  const dispatch = useDispatch();
  const currentWorkout = useSelector((state) => state.exercise.currentWorkout);
  return (
    <SafeAreaView className="flex-1 bg-black px-6 pb-40 items-center">
      <View className="w-full items-start mt-16">
        {/* title */}
        <Text className="text-white text-4xl font-interBold">{title}</Text>
      </View>
      {/* button bar */}
      <View className="w-full flex-row justify-between mt-6">
        <OutlineButton title="All" />
        <OutlineButton
          title="+ Add"
          onPress={() => dispatch(changeModalVisible(true))}
        />
      </View>

      {/* exercise list */}
      {currentWorkout.plan.length == 0 ? (
        <View className="flex-1 justify-center">
          <Text className="text-center text-white w-44 font-inter">
            Tap <Text className="font-interBold">Add</Text> to create a new
            exercise
          </Text>
        </View>
      ) : (
        <View className="w-full mt-6 rounded-[18px]">
          <FlatList
            className="rounded-[18px] "
            data={currentWorkout.plan ? currentWorkout.plan : plan}
            renderItem={({ item }) => <ExerciseRow plan={item} />}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
      <View className=" absolute bottom-16 items-end w-full">
        <Pressable
          className="bg-primary rounded-full h-20 w-20 justify-center items-center"
          onPress={() => {
            console.log("hi");
          }}
        >
          <Image
            style={{ resizeMode: "contain" }}
            source={require("../assets/play_button.png")}
            className="h-8 w-8"
          ></Image>
        </Pressable>
      </View>
      <AddExerciseModal />
    </SafeAreaView>
  );
};

export default Workout;
