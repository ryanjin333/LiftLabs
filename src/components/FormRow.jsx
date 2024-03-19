import { View, Text, TextInput } from "react-native";
import React from "react";

import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

const FormRow = ({ name, placeholder, value, isPassword, handleChange }) => {
  // fonts
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <TextInput
      className="h-16 w-full text-sm bg-transparent text-white px-4 border rounded-2xl"
      style={{ fontFamily: "Inter_400Regular" }}
      placeholderTextColor="#7C7C7C"
      placeholder={placeholder}
      secureTextEntry={isPassword}
      onChangeText={(value) =>
        handleChange(value, name.charAt(0).toLowerCase() + name.slice(1))
      }
      value={value}
    />
  );
};

export default FormRow;
