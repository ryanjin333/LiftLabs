import { View, Text, TextInput } from "react-native";
import React from "react";

const FormRow = ({ name, placeholder, value, isPassword, handleChange }) => {
  return (
    <TextInput
      className="h-16 w-full text-sm bg-transparent text-white px-4 border border-[#2C2C2C] rounded-2xl font-inter"
      placeholderTextColor="#7C7C7C"
      placeholder={placeholder}
      secureTextEntry={isPassword}
      keyboardAppearance="dark"
      onChangeText={(value) =>
        handleChange(value, name.charAt(0).toLowerCase() + name.slice(1))
      }
      value={value}
    />
  );
};

export default FormRow;
