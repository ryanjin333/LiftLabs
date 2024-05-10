import * as Haptics from "expo-haptics";
import {
  View,
  Text,
  Pressable,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { BlurView } from "expo-blur";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { useNavigation } from "@react-navigation/native";
import uuid from "react-native-uuid";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  changeModalVisible,
  changeExerciseName,
  createNewExercise,
} from "../context/exerciseSlice";

const initialState = {
  sets: 0,
  reps: 0,
  weight: 0,
  isLoading: false,
};

// miscellaneous functions
const listGenerator = (amount) => {
  var list = [];
  for (let i = 0; i <= amount; i++) {
    list.push(i.toString());
  }
  return list;
};

// CONSTANTS
const setList = listGenerator(100);
const repList = listGenerator(100);
const weightList = listGenerator(1000);

const AddExerciseModal = () => {
  const [values, setValues] = useState(initialState);

  // redux
  const dispatch = useDispatch();
  const modalVisible = useSelector((state) => state.exercise.modalVisible);
  const exerciseName = useSelector((state) => state.exercise.exerciseName);

  // navigation
  const navigation = useNavigation();

  // functions
  const donePressed = async () => {
    setValues({ ...values, isLoading: true });
    try {
      const newExercise = {
        id: uuid.v4(),
        title: exerciseName,
        sets: values.sets,
        reps: values.reps,
        weight: values.weight,
      };
      dispatch(createNewExercise(newExercise));
    } catch (error) {
      console.log(error);
    } finally {
      setValues({ ...values, isLoading: false });
      resetModal();
    }
  };

  const pickExercise = () => {
    navigation.navigate("SearchExercise");
    dispatch(changeModalVisible(false));
  };

  const resetModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    dispatch(changeModalVisible(false));
    dispatch(changeExerciseName(""));
    setValues({ ...values, sets: 0, reps: 0, weight: 0 });
  };
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View className="flex-1 items-center justify-end">
        {/* opaque background */}
        {modalVisible && (
          <Pressable
            className="absolute top-0 bottom-0 left-0 right-0 bg-black opacity-30"
            onPress={resetModal}
          />
        )}
        {/* modal view */}
        <View className="rounded-[18px] overflow-hidden h-96 w-full justify-center items-center">
          <BlurView
            intensity={60}
            tint="dark"
            className="h-96 w-full items-center px-5"
          >
            {/* exit button */}
            <View className=" w-full h-6 mt-5 justify-center items-end">
              <Pressable
                className="w-11 h-11 flex justify-start items-end mt-5"
                onPress={resetModal}
              >
                <Image
                  className="h-6 w-6"
                  source={require("../assets/exit.png")}
                />
              </Pressable>
            </View>
            {/* choose workout */}
            <Pressable onPress={pickExercise}>
              <View className="h-12 w-80 bg-[#292929] rounded-[25px] justify-center items-center flex-row space-x-2 mt-6">
                <Text
                  className="text-white"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  {exerciseName == "" ? "Choose Exercise" : exerciseName}
                </Text>

                <Image
                  className="h-5 w-5"
                  source={require("../assets/edit_icon.png")}
                />
              </View>
            </Pressable>
            <View className="flex-row w-64 items-center">
              {/* scroll sets */}

              <ScrollPicker
                dataSource={setList}
                selectedIndex={values.sets}
                renderItem={(data, index) => {
                  return (
                    <View>
                      <Text
                        className=" text-[#F0F2A6] text-lg"
                        style={{ fontFamily: "Inter_600SemiBold" }}
                      >
                        {data}
                      </Text>
                    </View>
                  );
                }}
                onValueChange={(data, selectedIndex) => {
                  setValues({ ...values, sets: selectedIndex });
                }}
                wrapperHeight={150}
                wrapperBackground="#ffffff0"
                itemHeight={50}
                highlightBorderWidth={0}
              />
              <Text
                className="text-white"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                sets
              </Text>
              {/* scroll reps */}
              <ScrollPicker
                dataSource={repList}
                selectedIndex={values.reps}
                renderItem={(data, index) => {
                  return (
                    <View>
                      <Text
                        className=" text-[#F0F2A6] text-lg"
                        style={{ fontFamily: "Inter_600SemiBold" }}
                      >
                        {data}
                      </Text>
                    </View>
                  );
                }}
                onValueChange={(data, selectedIndex) => {
                  setValues({ ...values, reps: selectedIndex });
                }}
                wrapperHeight={150}
                wrapperBackground="#ffffff0"
                itemHeight={50}
                highlightBorderWidth={0}
              />
              <Text
                className="text-white"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                reps
              </Text>
              {/* scroll weight */}
              <ScrollPicker
                dataSource={weightList}
                selectedIndex={values.weight}
                renderItem={(data, index) => {
                  return (
                    <View>
                      <Text
                        className=" text-[#F0F2A6] text-lg"
                        style={{ fontFamily: "Inter_600SemiBold" }}
                      >
                        {data}
                      </Text>
                    </View>
                  );
                }}
                onValueChange={(data, selectedIndex) => {
                  setValues({ ...values, weight: selectedIndex });
                }}
                wrapperHeight={150}
                wrapperBackground="#ffffff0"
                itemHeight={50}
                highlightBorderWidth={0}
              />
              <Text
                className="text-white"
                style={{ fontFamily: "Inter_500Medium" }}
              >
                lbs
              </Text>
            </View>
            {/* done button */}
            <Pressable
              className="h-12 w-28 rounded-full justify-center items-center bg-[#F0F2A6] mt-6"
              onPress={donePressed}
            >
              {values.isLoading ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <Text
                  className="text-base"
                  style={{ fontFamily: "Inter_600SemiBold" }}
                >
                  Done
                </Text>
              )}
            </Pressable>
          </BlurView>
        </View>
      </View>
    </Modal>
  );
};

export default AddExerciseModal;
