import { View, Text, Pressable, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// redux
import { useDispatch } from "react-redux";
import {
  changeModalVisible,
  changeExerciseName,
} from "../context/exerciseSlice";

const initialState = {
  prompt: "",
};

const SearchExercise = ({ navigation }) => {
  const [values, setValues] = useState(initialState);

  // redux
  const dispatch = useDispatch();

  // functions
  const goBack = () => {
    navigation.goBack();
    dispatch(changeModalVisible(true));
  };

  const submit = () => {
    dispatch(changeExerciseName(values.prompt));
    goBack();
  };
  return (
    <SafeAreaView className="flex-1 bg-black px-6">
      <View className="flex-row justify-center items-center space-x-4 mx-6 mt-6">
        {/* search textfield */}
        <TextInput
          className="border rounded-[18px] border-[#2C2C2C] w-full h-11 bg-transparent text-white px-4"
          style={{ fontFamily: "Inter_400Regular" }}
          placeholderTextColor="#7C7C7C"
          placeholder="Search exercise"
          onChangeText={(value) => setValues({ ...values, prompt: value })}
          value={values.prompt}
          onSubmitEditing={submit}
        />
        <Pressable onPress={goBack}>
          <Text
            className="text-white"
            style={{ fontFamily: "Inter_400Regular" }}
          >
            Cancel
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SearchExercise;
