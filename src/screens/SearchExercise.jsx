import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import filter from "lodash.filter";

// redux
import { useDispatch } from "react-redux";
import {
  changeModalVisible,
  changeExerciseName,
  addAllExercisesToFirestore,
} from "../context/exerciseSlice";

// firebase
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const API_ENDPOINT = "https://randomuser.me/api/?results=30";

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

  // fetch exercises
  useEffect(() => {
    dispatch(addAllExercisesToFirestore());
  }, []);

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
    const filteredData = filter(values.fullData.exercises, (item) => {
      return contains(item, formattedQuery);
    });
    const upperCasedFilteredData = filteredData.map((item) => {
      const upperCasedName =
        item.name[0].toUpperCase() + item.name.substring(1);
      return { gif: item.gif, name: upperCasedName };
    });
    // if query is empty, return an empty flatList otherwise keep flatList
    if (query == "") {
      setValues({ ...values, prompt: query, data: [] });
    } else {
      setValues({ ...values, prompt: query, data: upperCasedFilteredData });
    }
  };

  const contains = (exerciseInfo, query) => {
    const name = exerciseInfo.name;
    if (name.toLowerCase()?.includes(query)) {
      return true;
    }
    return false;
  };

  // functions
  const goBack = () => {
    navigation.goBack();
    dispatch(changeModalVisible(true));
  };

  const submit = () => {
    dispatch(changeExerciseName(values.prompt));
    goBack();
  };
  return (
    <SafeAreaView className="flex-1 bg-black px-6">
      <View className="flex-row justify-center items-center space-x-4 mx-6 mt-6">
        {/* search textfield */}
        <TextInput
          className="border rounded-[18px] border-[#2C2C2C] w-full h-11 bg-transparent text-white px-4 font-inter"
          placeholderTextColor="#7C7C7C"
          placeholder="Search exercise"
          onChangeText={(value) => handleSearch(value)}
          value={values.prompt}
          onSubmitEditing={submit}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {values.isLoading && (
          <ActivityIndicator className="ml-4" size={"small"} color="white" />
        )}
        <Pressable onPress={goBack}>
          <Text className="text-white font-inter">Cancel</Text>
        </Pressable>
      </View>
      <FlatList
        data={values.data}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View className="h-20 ">
            <Text className="text-white">{item.name}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default SearchExercise;
