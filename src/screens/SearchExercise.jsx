import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { Image } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import filter from "lodash.filter";
import { useDispatch } from "react-redux";
import {
  changeModalVisible,
  changeExerciseName,
  setExerciseGIF,
  addAllExercisesToFirestore,
} from "../context/exerciseSlice";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const initialState = {
  prompt: "",
  data: [],
  fullData: [],
  isLoading: false,
};

const SearchExercise = ({ navigation }) => {
  const [values, setValues] = useState(initialState);

  // redux
  const dispatch = useDispatch();

  // query exercise

  useEffect(() => {
    setValues({ ...values, isLoading: true });
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const exerciseRef = doc(db, "exercises", "allExercises");
      const exerciseSnap = await getDoc(exerciseRef);
      if (exerciseSnap.exists()) {
        // update fullData
        setValues({
          ...values,
          fullData: exerciseSnap.data(),
          isLoading: false,
        });
      } else {
        console.log("No such document!");
        // set loading to false
        setValues({
          ...values,
          isLoading: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (query) => {
    const formattedQuery = query.toLowerCase();

    // Assign relevance score based on query match
    const scoredData = values.fullData.exercises.map((exercise) => {
      let score = 0;
      if (exercise.name.toLowerCase() === formattedQuery) {
        score += 20; // Exact match
      } else if (exercise.name.toLowerCase().includes(formattedQuery)) {
        score += 10; // Partial match
      }

      // 2. Add points for exact or partial match in mainMuscle
      if (exercise.mainMuscle.toLowerCase().includes(formattedQuery)) {
        score += 5;
      }

      // Return the exercise object with the calculated score
      return { ...exercise, score };
    });

    // Sort exercises by relevance score in descending order
    const sortedData = scoredData.sort((a, b) => b.score - a.score);

    // Map the sorted data for display (capitalize first letter of each field)
    const upperCasedFilteredData = sortedData.map((item) => {
      const upperCasedName =
        item.name[0].toUpperCase() + item.name.substring(1);
      const upperCasedMainMuscle =
        item.mainMuscle[0].toUpperCase() + item.mainMuscle.substring(1);

      return {
        ...item,
        name: upperCasedName,
        mainMuscle: upperCasedMainMuscle,
      };
    });

    // Update the state with sorted data
    setValues({
      ...values,
      prompt: query,
      data: upperCasedFilteredData,
    });
  };

  const contains = (exerciseInfo, query) => {
    const name = exerciseInfo.name;
    if (name.toLowerCase()?.includes(query)) {
      return true;
    }
    return false;
  };

  // loading animations for gif images
  const loadingOpacity = useSharedValue(1);
  useEffect(() => {
    loadingOpacity.value = withRepeat(
      withTiming(0.6, { duration: 700 }),
      -1,
      true
    );
  }, []);

  // functions
  const goBack = () => {
    navigation.goBack();
    dispatch(changeModalVisible(true));
  };

  const submit = (name = values.prompt, gif = "") => {
    dispatch(changeExerciseName(name));
    dispatch(setExerciseGIF(gif));
    goBack();
  };
  return (
    <SafeAreaView className="flex-1 bg-black px-6">
      <View className="flex-row justify-center items-center space-x-4 mx-6 mt-6">
        {/* search textfield */}
        <TouchableWithoutFeedback onPress={() => {}}>
          <View className="w-full">
            <TextInput
              className="border rounded-[18px] overflow-hidden border-[#2C2C2C] w-full h-11 bg-transparent text-white px-4 font-inter"
              placeholderTextColor="#7C7C7C"
              placeholder="Search exercise"
              onChangeText={handleSearch}
              value={values.prompt}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
              focusable={false}
              keyboardAppearance="dark"
              returnKeyType="done"
            />
            {values.isLoading && (
              <ActivityIndicator
                className="ml-4 absolute right-4 top-3"
                size={"small"}
                color="white"
              />
            )}
          </View>
        </TouchableWithoutFeedback>
        <Pressable onPress={goBack}>
          <Text className="text-white font-inter">Cancel</Text>
        </Pressable>
      </View>
      {/* results */}
      <FlatList
        data={
          values.data.length === 0 ? values.fullData.exercises : values.data
        }
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="always"
        ListFooterComponent={<View className=" h-96 w-full" />}
        renderItem={({ item }) => (
          // result item
          <Pressable
            className="flex-row items-center space-x-4"
            onPress={() => {
              submit(item.name, item.gif);
            }}
          >
            <View className="rounded-[12px] overflow-hidden">
              <Image
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  overflow: "hidden",
                  backgroundColor: "transparent",
                }}
                source={{ uri: item.gif }}
                PlaceholderContent={
                  <Animated.View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      overflow: "hidden",
                      backgroundColor: "#3d3d3d",
                      opacity: loadingOpacity,
                    }}
                  />
                }
              />
            </View>

            <View className="h-16 justify-center">
              <Text className="text-white font-interSemiBold ">
                {item.name}
              </Text>
              <Text className="text-[#8f8f8f] font-inter text-xs">
                {item.mainMuscle}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default SearchExercise;
