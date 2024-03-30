import { View, Text, FlatList, Pressable } from "react-native";
import React, { useState } from "react";
import OutlineButton from "./OutlineButton";
import { BlurView } from "expo-blur";

const filters = [
  {
    title: "All",
  },
  {
    title: "Mine",
  },
  {
    title: "Shared",
  },
];
const initialState = {
  dropdownVisibility: false,
  title: "All",
};

const DropdownRow = ({ title, values, setValues }) => {
  const filterPressed = () => {
    setValues({
      ...values,
      title: title,
      dropdownVisibility: !values.dropdownVisibility,
    });
  };
  return (
    <Pressable
      className="w-20 h-8 bg-transparent justify-center items-center"
      onPress={filterPressed}
    >
      <Text className="text-white">{title}</Text>
    </Pressable>
  );
};
const Dropdown = () => {
  const [values, setValues] = useState(initialState);

  return (
    <>
      <OutlineButton
        title={values.title}
        onPress={() =>
          setValues({
            ...values,
            dropdownVisibility: !values.dropdownVisibility,
          })
        }
      />
      {values.dropdownVisibility && (
        <View className="absolute w-20 mt-10 rounded-[18px] overflow-hidden">
          <BlurView intensity={60} tint="dark">
            <FlatList
              data={filters}
              renderItem={({ item }) => (
                <DropdownRow
                  title={item.title}
                  values={values}
                  setValues={setValues}
                />
              )}
              keyExtractor={(item) => item.title}
            />
          </BlurView>
        </View>
      )}
    </>
  );
};

export default Dropdown;
