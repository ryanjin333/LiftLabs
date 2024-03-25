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
import uuid from "react-native-uuid";
import * as ImagePicker from "expo-image-picker";

// firebase
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../config/firebase";

const initialState = {
  title: "",
  image: null,
  isLoading: false,
};

const AddWorkoutModal = ({ modalVisible, setModalVisible }) => {
  const [values, setValues] = useState(initialState);

  // functions
  const resetModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setModalVisible(!modalVisible);
    setValues({ ...values, title: "", image: null });
  };

  const donePressed = async () => {
    setValues({ ...values, isLoading: true });
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        workouts: arrayUnion({
          id: uuid.v4(),
          title: values.title,
          image: values.image
            ? { uri: values.image }
            : require("../assets/React_Native_Logo.png"),
          plan: [],
          createdBy: "uid",
        }),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setValues({ ...values, isLoading: false });
      resetModal();
    }
  };

  // TODO: add button press indicators, loading, and put workout into redux

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

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
                <TextInput
                  className="border-b border-[#2C2C2C] w-72 h-11 bg-transparent text-white px-4 mt-3"
                  style={{ fontFamily: "Inter_400Regular" }}
                  placeholderTextColor="#7C7C7C"
                  placeholder="Title"
                  onChangeText={(value) =>
                    setValues({ ...values, title: value })
                  }
                  value={values.title}
                />
              </View>
              {/* done button */}
              <Pressable
                className="h-12 w-28 rounded-full justify-center items-center bg-[#F0F2A6] mt-16"
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
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddWorkoutModal;
