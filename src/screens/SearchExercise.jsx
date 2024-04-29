import { View, Text, Pressable, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const initialState = {
  prompt: "",
};

const SearchExercise = () => {
  const [values, setValues] = useState(initialState);
  return (
    <SafeAreaView className="flex-1 bg-black px-6">
      <View className="flex-row justify-center items-center space-x-4 mx-6 mt-6">
        {/* search textfield */}
        <TextInput
          className="border rounded-[18px] border-[#2C2C2C] w-full h-11 bg-transparent text-white px-4"
          style={{ fontFamily: "Inter_400Regular" }}
          placeholderTextColor="#7C7C7C"
          placeholder="Search username"
          onChangeText={(value) => setValues({ ...values, prompt: value })}
          value={values.prompt}
        />
        <Pressable>
          <Text className="text-white">Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SearchExercise;
