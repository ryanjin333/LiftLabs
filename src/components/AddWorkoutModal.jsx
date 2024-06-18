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
import uuid from "react-native-uuid";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../config/firebase";

// redux
import { useDispatch, useSelector } from "react-redux";
import { createNewWorkout, changeModalVisible } from "../context/workoutSlice";
import ModalDoneButton from "./ModalDoneButton";

const initialState = {
  title: "",
  image: null,
  isLoading: false,
};

const AddWorkoutModal = () => {
  const [values, setValues] = useState(initialState);

  // redux
  const dispatch = useDispatch();
  const modalVisible = useSelector((state) => state.workout.modalVisible);

  // functions
  const resetModal = () => {
    dispatch(changeModalVisible(false));
    setValues({ ...values, title: "", image: null });
  };

  const donePressed = async () => {
    // if the title is not empty, add to list otherwise warn users
    if (values.title == "") {
      // display alert
      console.log("empty title");
      return;
    }
    setValues({ ...values, isLoading: true });
    try {
      const newWorkout = {
        id: uuid.v4(),
        title: values.title,
        image: values.image
          ? { uri: values.image }
          : "../assets/React_Native_Logo.png",
        plan: [],
        createdBy: auth.currentUser.uid,
      };
      dispatch(createNewWorkout(newWorkout));
    } catch (error) {
      console.log(error);
    } finally {
      setValues({ ...values, isLoading: false });
      resetModal();
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setValues({ ...values, image: result.assets[0].uri });
    }
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
              <View className="flex-row justify-between w-full">
                {/* optional image */}
                <Pressable onPress={pickImage}>
                  <View className="absolute h-7 w-7 top-0 right-0 bg-[#515151a8] z-10 rounded-full justify-center items-center">
                    <Image
                      className="h-4 w-4"
                      source={require("../assets/edit_icon.png")}
                    />
                  </View>
                  <Image
                    className="h-16 w-16 rounded-[18px] mt-2 mr-2 overflow-hidden"
                    source={
                      values.image
                        ? { uri: values.image }
                        : require("../assets/React_Native_Logo.png")
                    }
                  />
                </Pressable>
                {/* title textfield */}
                <View className="items-end">
                  <TextInput
                    className="border-b border-[#2C2C2C] w-72 h-11 bg-transparent text-white px-4 mt-3 mb-2 font-inter"
                    placeholderTextColor="#7C7C7C"
                    placeholder="Title"
                    keyboardAppearance="dark"
                    maxLength={20}
                    onChangeText={(value) =>
                      setValues({ ...values, title: value })
                    }
                    value={values.title}
                  />
                  <Text className="text-[#7C7C7C] text-xs font-inter">
                    Limit: {values.title.length}/20
                  </Text>
                </View>
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

export default AddWorkoutModal;
