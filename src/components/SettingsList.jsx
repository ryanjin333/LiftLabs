import { View, Text, FlatList, Pressable, Image } from "react-native";
import React from "react";
import SwitchSelector from "react-native-switch-selector";

import SelectDropdown from "react-native-select-dropdown";

import { useSelector, useDispatch } from "react-redux";
import { setInfo } from "../context/userSlice";

const TextOnly = ({ text }) => {
  return <Text className="text-[#5e5e5e] font-interMedium">{text}</Text>;
};

const TextAndNavigation = ({ text }) => {
  return (
    <View className="flex-row space-x-3 items-center">
      <Text className="text-[#5e5e5e] font-interMedium">
        {text == "" ? "Not set" : text}
      </Text>
      <Image
        className="w-7 h-7"
        source={require("../assets/forward_chevron.png")}
      />
    </View>
  );
};

const SwitcherOnly = () => {
  // redux
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  return (
    <SwitchSelector
      className="w-48"
      initial={user.weight == "lbs" ? 0 : 1}
      onPress={(value) => dispatch(setInfo({ key: "weight", value: value }))} // switches weight conversion
      textColor={"#fff"}
      selectedColor={"#ffffff"}
      buttonColor={"#676767"}
      backgroundColor={"#212121"}
      borderWidth={0}
      hasPadding
      options={[
        { label: "lbs", value: "lbs" },
        { label: "kg", value: "kg" },
      ]}
      borderRadius={14}
    />
  );
};

const NavigationOnly = () => {
  return (
    <Image
      className="w-7 h-7"
      source={require("../assets/forward_chevron.png")}
    />
  );
};

const WorkoutPicker = () => {
  // redux
  const workout = useSelector((state) => state.workout);
  const allWorkouts = [...workout.workouts, ...workout.sharedWorkouts];

  return (
    <SelectDropdown
      data={allWorkouts}
      onSelect={(selectedItem, index) => {
        console.log(selectedItem, index);
      }}
      renderButton={(selectedItem, isOpened) => {
        return (
          <Pressable
            onPress={() => {
              allWorkouts.forEach((workout) => {
                console.log(workout.title);
              });
            }}
          >
            <View className="bg-[#676767] rounded-full h-8 w-16 justify-center items-center">
              <Text className="text-white font-interMedium">+ Add</Text>
            </View>
          </Pressable>
        );
      }}
    />
  );
};

const SettingsList = ({ data }) => {
  return (
    <View className="w-full">
      <View className="w-full mt-6 rounded-[18px] overflow-hidden ">
        <FlatList
          scrollEnabled={false}
          className="rounded-[18px]"
          data={data.data}
          renderItem={({ item }) => (
            <Pressable
              className="w-full h-14 bg-[#151515] flex-row  items-center justify-between px-5"
              onPress={() => {
                item.action();
              }}
            >
              <Text className="text-white text-sm font-interSemiBold">
                {item.title}
              </Text>

              {/* add functions */}
              {item.title == "Email" || item.title == "App version" ? (
                <TextOnly text={item.text} />
              ) : (
                <>
                  {item.title == "Username" || item.title == "Full name" ? (
                    <TextAndNavigation text={item.text} />
                  ) : (
                    <>
                      {item.title == "Weight" ? (
                        <SwitcherOnly />
                      ) : (
                        <>
                          {data.title == "Calendar" ? (
                            <WorkoutPicker />
                          ) : (
                            <NavigationOnly />
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </Pressable>
          )}
          keyExtractor={(item, index) => item.title + index}
        />
      </View>
    </View>
  );
};

export default SettingsList;
