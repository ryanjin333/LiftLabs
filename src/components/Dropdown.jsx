import { View, Text, FlatList, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import OutlineButton from "./OutlineButton";
import { BlurView } from "expo-blur";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
} from "react-native-reanimated";

// redux
import { useSelector, useDispatch } from "react-redux";
import { changeDropdownTitle } from "../context/workoutSlice";

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
};

const DropdownRow = ({ title, values, setValues }) => {
  // redux
  const dispatch = useDispatch();

  const filterPressed = () => {
    dispatch(changeDropdownTitle(title));
    setValues({
      ...values,
      dropdownVisibility: !values.dropdownVisibility,
    });
  };
  return (
    <Pressable
      className="w-20 h-8 bg-transparent justify-center items-center"
      onPress={filterPressed}
    >
      <Text className="text-white font-inter">{title}</Text>
    </Pressable>
  );
};

const Dropdown = () => {
  const [values, setValues] = useState(initialState);

  // redux
  const dropdownTitle = useSelector((state) => state.workout.dropdownTitle);
  return (
    <>
      <OutlineButton
        title={dropdownTitle}
        onPress={() =>
          setValues({
            ...values,
            dropdownVisibility: !values.dropdownVisibility,
          })
        }
      />
      {values.dropdownVisibility && (
        <Animated.View
          className="absolute w-20 mt-10 rounded-[18px] overflow-hidden"
          entering={FadeInUp.duration(1000).springify()}
          exiting={FadeOutUp.duration(1000).springify()}
        >
          <BlurView intensity={60} tint="dark">
            <FlatList
              data={filters}
              scrollEnabled={false}
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
        </Animated.View>
      )}
    </>
  );
};

export default Dropdown;
