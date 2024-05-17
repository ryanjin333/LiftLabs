import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableWithoutFeedback,
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
      // uppercase the first letter of each result before returning to result list
      const upperCasedName =
        item.name[0].toUpperCase() + item.name.substring(1);
      const upperCasedMainMuscle =
        item.mainMuscle[0].toUpperCase() + item.mainMuscle.substring(1);

      return {
        gif: item.gif,
        name: upperCasedName,
        mainMuscle: upperCasedMainMuscle,
        id: item.id,
      };
    });

    // if filtered data length is greater than maxAmount, slice it
    // var optimizedUpperCasedFilteredData = [];
    // const maxAmount = 100;
    // if (upperCasedFilteredData.length > maxAmount) {
    //   optimizedUpperCasedFilteredData = upperCasedFilteredData.slice(
    //     0,
    //     maxAmount
    //   );
    // }

    // if query is empty, return an empty flatList otherwise keep flatList
    if (query == "") {
      setValues({ ...values, prompt: query, data: [] });
    } else {
      setValues({
        ...values,
        prompt: query,
        data: upperCasedFilteredData,
      });
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

  const submit = (name = values.prompt) => {
    dispatch(changeExerciseName(name));
    goBack();
  };
  return (
    <SafeAreaView className="flex-1 bg-black px-6">
      <View className="flex-row justify-center items-center space-x-4 mx-6 mt-6">
        {/* search textfield */}
        <TouchableWithoutFeedback onPress={() => {}}>
          <TextInput
            className="border rounded-[18px] border-[#2C2C2C] w-full h-11 bg-transparent text-white px-4 font-inter"
            placeholderTextColor="#7C7C7C"
            placeholder="Search exercise"
            onChangeText={(value) => handleSearch(value)}
            value={values.prompt}
            onSubmitEditing={submit}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            focusable={false}
            returnKeyType="done"
          />
        </TouchableWithoutFeedback>
        {values.isLoading && (
          <ActivityIndicator className="ml-4" size={"small"} color="white" />
        )}
        <Pressable onPress={goBack}>
          <Text className="text-white font-inter">Cancel</Text>
        </Pressable>
      </View>
      {/* results */}
      <FlatList
        data={values.data}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="always"
        ListFooterComponent={<View className=" h-96 w-full" />}
        renderItem={({ item }) => (
          // result item
          <Pressable
            className="flex-row items-center space-x-4"
            onPress={() => {
              submit(item.name);
            }}
          >
            <Image
              className="h-12 w-12 overflow-hidden rounded-[12px]"
              source={{ uri: item.gif }}
            />
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
