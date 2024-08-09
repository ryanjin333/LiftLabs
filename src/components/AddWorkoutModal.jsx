import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { BlurView } from "expo-blur";
import uuid from "react-native-uuid";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";

import { Image as LoadingImage } from "@rneui/themed";

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../config/firebase";

import FlashMessage, { showMessage } from "react-native-flash-message";

import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useDispatch, useSelector } from "react-redux";
import {
  createNewWorkout,
  changeModalVisible,
  editWorkout,
  deleteWorkout,
  setEditModeWorkout,
} from "../context/workoutSlice";
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
  const editModeWorkout = useSelector((state) => state.workout.editModeWorkout);

  useEffect(() => {
    if (editModeWorkout !== null) {
      // the current modal is in edit mode
      const { title, image } = editModeWorkout;
      setValues({
        ...values,
        title: title,
        image: image,
      });
    }
  }, [editModeWorkout, modalVisible]);

  // functions
  const resetModal = () => {
    dispatch(changeModalVisible(false));
    dispatch(setEditModeWorkout(null));
    setValues({ ...values, title: "", image: null });
  };
  // animations

  const loadingOpacity = useSharedValue(1);
  useEffect(() => {
    loadingOpacity.value = withRepeat(
      withTiming(0.6, { duration: 700 }),
      -1,
      true
    );
  }, []);

  // when editing get the image TODO
  // useEffect(() => {
  //   const fetchImageUrl = async () => {
  //     try {
  //       const imageLinkSnap = await getDoc(
  //         doc(db, "users", auth.currentUser.uid)
  //       );
  //       const imageRef = ref(storage, imageLinkSnap.data().pfp); // get current workout
  //       const url = await getDownloadURL(pfpRef);
  //       setValues({ ...values, image: url });
  //     } catch (error) {
  //       console.error("Error getting the image URL:", error);
  //     }
  //   };

  //   fetchImageUrl();
  // }, []);

  const donePressed = async () => {
    // if the title is not empty, add to list otherwise warn users
    if (values.title == "") {
      // display alert
      showMessage({
        message: "Missing title",
        type: "danger",
      });
      return;
    }
    setValues({ ...values, isLoading: true });

    try {
      if (editModeWorkout !== null) {
        // edit workout
        const updatedWorkout = {
          id: editModeWorkout.id,
          title: values.title,
          image: values.image
            ? values.image
            : "../assets/React_Native_Logo.png", // use default image if custom image isn't provided
          plan: editModeWorkout.plan,
          createdBy: auth.currentUser.uid,
        };
        dispatch(editWorkout(updatedWorkout));
      } else {
        // add workout
        const newWorkout = {
          id: uuid.v4(),
          title: values.title,
          image: values.image
            ? values.image
            : "../assets/React_Native_Logo.png", // use default image if custom image isn't provided
          plan: [],
          createdBy: auth.currentUser.uid,
        };
        dispatch(createNewWorkout(newWorkout));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setValues({ ...values, isLoading: false });
      resetModal();
    }
  };

  const deletePressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    resetModal();
    dispatch(
      deleteWorkout({
        workout: editModeWorkout,
        type: "workouts",
      })
    );
  };

  const pickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Let user pick an image from the media library

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      // Create a reference to the file
      const imageRef = ref(
        storage,
        `images/${auth.currentUser.uid}/workouts/${Date.now()}.jpg`
      );

      // Convert image to byte array
      const response = await fetch(uri);
      const blob = await response.blob();

      // Send image to Storage
      const uploadTask = uploadBytesResumable(imageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // checks the percentage done
          const progress = int(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          // SHOW % FINISHED
          showMessage({
            message: "upload " + { progress } + "% complete",
          });
        },
        (error) => {
          // IMAGE UPLOAD ERROR
          showMessage({
            message: "Error uploading the image",
            type: "danger",
          });
        },
        async () => {
          // if successful, create a download url and set it both in firestore and locally
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setValues({ ...values, image: downloadURL });
        }
      );
    } catch (error) {
      console.error("Error uploading the image:", error);
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
          <View className="rounded-[18px] overflow-hidden h-80 w-full justify-center items-center">
            <BlurView
              intensity={60}
              tint="dark"
              className="h-80 w-full items-center px-5"
            >
              <View className="flex-row w-full h-6 mt-5 justify-between items-center mb-10">
                {/* delete button */}
                {editModeWorkout ? (
                  <Pressable
                    className="w-10 h-10 flex justify-center items-center mt-5 rounded-full bg-[#292929]"
                    onPress={deletePressed}
                  >
                    <Image
                      className="h-6 w-6"
                      source={require("../assets/delete.png")}
                    />
                  </Pressable>
                ) : (
                  <View className="w-10 h-10 flex justify-center items-center mt-5 rounded-full bg-opacity-0" />
                )}
                {/* exit button */}
                <Pressable
                  className="w-10 h-10 flex justify-center items-center mt-5 rounded-full bg-[#292929]"
                  onPress={resetModal}
                >
                  <Image
                    className="h-5 w-5"
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
                  <LoadingImage
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 18,
                      overflow: "hidden",
                      marginHorizontal: 8,
                    }}
                    source={
                      values.image
                        ? { uri: values.image }
                        : require("../assets/React_Native_Logo.png")
                    }
                    PlaceholderContent={
                      <Animated.View
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 18,
                          overflow: "hidden",
                          backgroundColor: "#2b2b2b",
                          opacity: loadingOpacity,
                        }}
                      />
                    }
                  />
                </Pressable>
                {/* title textfield */}
                <View className="items-end">
                  <TextInput
                    className="border-b border-[#2C2C2C] w-64 h-11 bg-transparent text-white px-4 mt-3 mb-2 font-inter"
                    placeholderTextColor="#7C7C7C"
                    placeholder="Title"
                    keyboardAppearance="dark"
                    maxLength={15}
                    onChangeText={(value) =>
                      setValues({ ...values, title: value })
                    }
                    value={values.title}
                  />
                  <Text className="text-[#7C7C7C] text-xs font-inter">
                    Limit: {values.title.length}/15
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
        <FlashMessage autoHide={false} />
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddWorkoutModal;
