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
} from "../context/exerciseSlice";

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

  // query exercise

  useEffect(() => {
    setValues({ ...values, isLoading: true });
    fetchData(API_ENDPOINT);
  }, []);

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      setValues({
        ...values,
        data: json.results,
        fullData: json.results,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (query) => {
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(values.fullData, (user) => {
      return contains(user, formattedQuery);
    });
    setValues({ ...values, prompt: query, data: filteredData });
  };

  const contains = ({ name, email }, query) => {
    const { first, last } = name;
    if (
      first.toLowerCase()?.includes(query) ||
      last.toLowerCase()?.includes(query) ||
      email.toLowerCase()?.includes(query)
    ) {
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
        keyExtractor={(item) => item.login.username}
        renderItem={({ item }) => (
          <View className="h-20 ">
            <Image
              className="h-4 w-4 rounded-[18px]"
              source={{ uri: item.picture.thumbnail }}
            />
            <Text className="text-white">
              {item.name.first} {item.name.last}
            </Text>
            <Text className="text-white">{item.email}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default SearchExercise;
