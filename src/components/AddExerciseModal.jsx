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

// redux
import { useDispatch, useSelector } from "react-redux";
import { changeModalVisible } from "../context/exerciseSlice";

const initialState = {
  title: "",
  sets: 1,
  reps: 1,
  weight: 0,
  isLoading: false,
};

const AddExerciseModal = () => {
  const [values, setValues] = useState(initialState);

  // redux
  const dispatch = useDispatch();
  const modalVisible = useSelector((state) => state.exercise.modalVisible);

  // functions
  const resetModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    dispatch(changeModalVisible(false));
    setValues({ ...values, title: "", sets: 1, reps: 1, weight: 0 });
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
        <View className="rounded-[18px] overflow-hidden h-72 w-full justify-center items-center">
          <BlurView
            intensity={60}
            tint="dark"
            className="h-72 w-full items-center px-5"
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
          </BlurView>
        </View>
      </View>
    </Modal>
  );
};

export default AddExerciseModal;
