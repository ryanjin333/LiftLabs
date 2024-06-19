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
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import uuid from "react-native-uuid";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  changeModalVisible,
  changeExerciseName,
  createNewExercise,
  setEditModePlan,
} from "../context/exerciseSlice";
import ModalDoneButton from "./ModalDoneButton";

const initialState = {
  sets: 0,
  reps: 0,
  weight: 0,
  isLoading: false,
};

// Secondary components

const Input = ({ title, values, setValues }) => {
  return (
    <View className="space-x-2 flex-row mt-6 items-center ">
      <TextInput
        className="border-b border-[#2C2C2C] w-12 bg-transparent text-primary text-base font-interSemiBold text-center pb-1"
        placeholderTextColor="#7C7C7C"
        placeholder="0"
        keyboardType="number-pad"
        keyboardAppearance="dark"
        onChangeText={(value) => setValues({ ...values, [title]: value })}
        value={
          title == "weight"
            ? values.weight
            : title == "reps"
            ? values.reps
            : values.sets
        }
      />
      <Text className="text-white font-interMedium mr-2">
        {title === "weight" ? "lbs" : title}
      </Text>
    </View>
  );
};

// main component

const AddExerciseModal = () => {
  const [values, setValues] = useState(initialState);

  // redux
  const dispatch = useDispatch();
  const modalVisible = useSelector((state) => state.exercise.modalVisible);
  const exerciseName = useSelector((state) => state.exercise.exerciseName);
  const editModePlan = useSelector((state) => state.exercise.editModePlan);

  // navigation
  const navigation = useNavigation();

  // functions

  useEffect(() => {
    if (editModePlan !== null) {
      // the current modal is in edit mode
      const { sets, weight, reps, title } = editModePlan;
      dispatch(changeExerciseName(title));
      setValues({
        ...values,
        sets: sets,
        weight: weight,
        reps: reps,
      });
    }
  }, [editModePlan]);

  const donePressed = async () => {
    // if the title is not empty, add to list otherwise warn users
    if (exerciseName == "") {
      // display alert
      console.log("empty title");
      return;
    }
    setValues({ ...values, isLoading: true });
    try {
      if (editModePlan !== null) {
        // edit exercise
      } else {
        // new exercise
        const newExercise = {
          id: uuid.v4(),
          title: exerciseName,
          sets: values.sets,
          reps: values.reps,
          weight: values.weight,
        };
        dispatch(createNewExercise(newExercise));
      }
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
    dispatch(changeModalVisible(false));
    dispatch(changeExerciseName(""));
    dispatch(setEditModePlan(null));
    setValues({ ...values, sets: 0, reps: 0, weight: 0 });
  };
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center"
      >
        <View className="flex-1 items-center justify-end">
          {/* opaque background */}
          {modalVisible && (
            <Pressable
              className="absolute top-0 bottom-0 left-0 right-0 bg-black opacity-30"
              onPress={resetModal}
            />
          )}
          {/* modal view */}
          <View className="rounded-[18px] overflow-hidden h-80 w-full justify-center items-center">
            <BlurView
              intensity={60}
              tint="dark"
              className="h-80 w-full items-center px-5"
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
              {/* choose exercise */}
              <Pressable onPress={pickExercise}>
                <View className="h-12 w-80 bg-[#292929] rounded-[25px] justify-center items-center flex-row space-x-2 mt-6 px-10">
                  <Text
                    className="text-white font-interSemiBold "
                    numberOfLines={1}
                  >
                    {exerciseName == "" ? "Choose Exercise" : exerciseName}
                  </Text>

                  <Image
                    className="h-5 w-5"
                    source={require("../assets/edit_icon.png")}
                  />
                </View>
              </Pressable>
              <View className="flex-row w-64 items-center justify-center">
                {/* scroll sets */}
                <Input title="sets" values={values} setValues={setValues} />
                {/* scroll reps */}
                <Input title="reps" values={values} setValues={setValues} />
                {/* scroll weight */}
                <Input title="weight" values={values} setValues={setValues} />
              </View>
              {/* done button */}
              <ModalDoneButton
                isLoading={values.isLoading}
                onPress={donePressed}
              />
            </BlurView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddExerciseModal;
