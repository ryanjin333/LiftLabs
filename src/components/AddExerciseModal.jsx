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

// redux
import { useDispatch } from "react-redux";
import { createNewWorkout } from "../context/workoutSlice";

const initialState = {
  title: "",
  sets: 0,
  reps: 0,
  weight: 0,
  isLoading: false,
};

const AddExerciseModal = () => {
  const [values, setValues] = useState(initialState);
  return <View></View>;
};

export default AddExerciseModal;
