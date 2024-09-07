import { View, Text, TextInput, TouchableWithoutFeedback } from "react-native";
import React from "react";

const FormRow = ({
  name,
  placeholder,
  value,
  isPassword = false,
  handleChange,
  autoFocus = false,
}) => {
  return (
    <TouchableWithoutFeedback onPress={() => {}}>
      <TextInput
        className="h-14 w-full text-sm bg-transparent text-white px-4 border border-[#2C2C2C] rounded-2xl font-inter"
        placeholderTextColor="#7C7C7C"
        placeholder={placeholder}
        secureTextEntry={isPassword}
        keyboardAppearance="dark"
        selectionColor="white"
        autoCapitalize="none"
        autoFocus={false}
        focusable={false}
        onChangeText={(value) => {
          handleChange(
            value,
            name == "Full name"
              ? "fullName"
              : name.charAt(0).toLowerCase() + name.slice(1)
          );
        }}
        value={value}
      />
    </TouchableWithoutFeedback>
  );
};

export default FormRow;
