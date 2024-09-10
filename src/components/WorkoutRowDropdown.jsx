import { View, Text, FlatList, Pressable, Image, Alert } from "react-native";
import React, { useState, useEffect } from "react";

import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInUp,
  FadeInRight,
  FadeOutUp,
  FadeOutRight,
} from "react-native-reanimated";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  deleteWorkout,
  changeModalVisible,
  setEditModeWorkout,
} from "../context/workoutSlice";

const options = [
  {
    title: "Edit",
    color: "#ffffff",
  },
  {
    title: "Delete",
    color: "#ff0000",
  },
];
const initialState = {
  dropdownVisibility: false,
};

const DropdownRow = ({ item, values, setValues, currentWorkout }) => {
  // redux
  const dispatch = useDispatch();

  const filterPressed = () => {
    if (item.title == "Delete") {
      // create a confirmation alert
      Alert.alert("Delete workout?", "", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            dispatch(
              deleteWorkout({ workout: currentWorkout, type: "workouts" })
            );
          },
        },
      ]);
    } else {
      // edit list
      dispatch(setEditModeWorkout(currentWorkout));
      dispatch(changeModalVisible(true));
    }
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
      <Text className=" font-interSemiBold" style={{ color: item.color }}>
        {item.title}
      </Text>
    </Pressable>
  );
};

const WorkoutRowDropdown = ({ currentWorkout }) => {
  const [values, setValues] = useState(initialState);

  // animations
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(values.dropdownVisibility ? 1 : 0, {
        duration: 300,
      }),
    };
  });

  return (
    <View className="items-center  space-x-2 flex-row ">
      {/* menu */}
      {values.dropdownVisibility && (
        <Animated.View
          className="w-20 rounded-[18px] overflow-hidden"
          style={animatedStyle}
        >
          <FlatList
            className="bg-[#242424]"
            data={options}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <DropdownRow
                item={item}
                values={values}
                setValues={setValues}
                currentWorkout={currentWorkout}
              />
            )}
            keyExtractor={(item) => item.title}
          />
        </Animated.View>
      )}
      {/* menu button */}
      <Pressable
        className="h-10 w-10 justify-center items-center "
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
          setValues({
            ...values,
            dropdownVisibility: !values.dropdownVisibility,
          });
        }}
      >
        <Image
          className="h-5 w-5"
          source={require("../assets/menu_vertical.png")}
        />
      </Pressable>
    </View>
  );
};

export default WorkoutRowDropdown;
