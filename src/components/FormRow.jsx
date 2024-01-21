import { View, Text, TextInput } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";

import { Inter_400Regular, useFonts } from "@expo-google-fonts/inter";

const FormRow = ({ name, placeholder, value, isPassword, handleChange }) => {
  // fonts
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View className=" rounded-2xl overflow-hidden mt-7">
      <BlurView intensity={30}>
        <TextInput
          className="h-16 text-sm bg-transparent text-white px-4"
          placeholderTextColor="#7C7C7C"
          placeholder={placeholder}
          secureTextEntry={isPassword ? true : false}
          onChangeText={(value) =>
            handleChange(value, name.charAt(0).toLowerCase() + name.slice(1))
          }
          value={value}
        ></TextInput>
      </BlurView>
    </View>
  );
};

export default FormRow;
