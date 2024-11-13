import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  SectionList,
} from "react-native";
import React, { useState, useEffect } from "react";
import SwitchSelector from "react-native-switch-selector";

import { useSelector, useDispatch } from "react-redux";
import { setInfo } from "../context/userSlice";

import * as Haptics from "expo-haptics";

import { WorkoutHelpers } from "../helpers/general";

import Modal from "react-native-modal";
import { BlurView } from "expo-blur";
import {
  addWorkoutToDay,
  deleteWorkoutFromDay,
} from "../context/calendarSlice";

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

const WorkoutPicker = ({ title }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const dispatch = useDispatch();

  // fetch all workouts the user has and combine them
  const workout = useSelector((state) => state.workout);

  const allWorkouts = [
    ...(workout.workouts || []),
    ...(workout.sharedWorkouts || []),
  ];
  const DATA = [
    {
      title: title,
      data: allWorkouts,
    },
  ];

  // pick the specific day im on
  const days = useSelector((state) => state.calendar.days);
  const day = days[title.toLowerCase()];
  const [workoutName, setWorkoutName] = useState("");
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const workout = await WorkoutHelpers.idToWorkout(day[0], allWorkouts);
        setWorkoutName(workout.title);
      } catch (error) {
        console.error("Error fetching workout:", error);
      }
    };

    if (day && day.length > 0 && allWorkouts) {
      fetchWorkout();
    }
  }, [day, allWorkouts]);

  return (
    <>
      {/* switches between an add button and a workout delete button when workout is already added */}
      {day.length === 0 ? (
        <Pressable
          onPress={() => {
            setIsVisible(true);
          }}
        >
          <View className="bg-[#676767] rounded-full h-8 w-16 justify-center items-center">
            <Text className="text-white font-interMedium">+ Add</Text>
          </View>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => {
            // empty local day workouts
            // empty database day workouts
            dispatch(deleteWorkoutFromDay({ day: title.toLowerCase() }));
          }}
        >
          <View className="bg-[#676767] rounded-full h-8 justify-center items-center px-4">
            <Text className="text-white font-interMedium">{workoutName}</Text>
            <View className="h-4 w-4 bg-[#ce2121] absolute -right-1 -top-1 rounded-full justify-center items-center">
              <Image
                className="h-2 w-2"
                source={require("../assets/exit.png")}
              />
            </View>
          </View>
        </Pressable>
      )}

      {/* pick workout popup */}
      <Modal isVisible={isVisible}>
        <Pressable
          className="flex-1 justify-end pb-5 gap-y-4"
          onPress={() => setIsVisible(false)}
        >
          <BlurView
            className="rounded-[26px] overflow-hidden"
            intensity={60}
            tint="dark"
            style={{ height: contentHeight || 200 }} // Fallback to 200px if height is not calculated yet
          >
            <SectionList
              sections={DATA}
              keyExtractor={(item, index) => item.title + index}
              onContentSizeChange={(width, height) => setContentHeight(height)} // Dynamically set the height
              renderItem={({ item, section }) => (
                <Pressable
                  className="items-center justify-center h-16"
                  style={{
                    borderTopWidth: 1,
                    borderColor: "#1b1b1b",
                  }}
                  onPress={async () => {
                    // console.log(
                    //   `Item: ${item.title}, Section: ${section.title} ID: ${item.id}`
                    // );
                    dispatch(
                      addWorkoutToDay({
                        day: section.title.toLowerCase(),
                        id: item.id,
                      })
                    );
                    const workout = await WorkoutHelpers.idToWorkout(item.id);
                    console.log(workout);
                  }}
                >
                  <Text className="text-white font-interMedium">
                    {item.title}
                  </Text>
                </Pressable>
              )}
              renderSectionHeader={({ section: { title } }) => (
                <View className="items-center justify-center h-20">
                  <Text className="text-white font-interBold text-lg">
                    {title}
                  </Text>
                  <Text className="text-[#727272] font-interMedium">
                    Select a workout for this day
                  </Text>
                </View>
              )}
            />
          </BlurView>
          <BlurView
            className="rounded-[26px] overflow-hidden h-16 justify-center items-center"
            intensity={60}
            tint="dark"
          >
            <Pressable onPress={() => setIsVisible(false)}>
              <Text className="font-interMedium text-[#ff3131]">Cancel</Text>
            </Pressable>
          </BlurView>
        </Pressable>
      </Modal>
    </>
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
                            <WorkoutPicker title={item.title} />
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
