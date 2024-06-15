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

// firebase
import { auth, db } from "../config/firebase";
import {
  collection,
  query,
  where,
  limit,
  orderBy,
  startAt,
  endAt,
  getDocs,
} from "firebase/firestore";

const initialState = {
  prompt: "",
  data: [],
  isLoading: false,
};

const SearchUser = ({ navigation }) => {
  const [values, setValues] = useState(initialState);

  // redux
  const dispatch = useDispatch();

  // query users
  const handleSearch = async (prompt) => {
    const formattedPrompt = prompt.toLowerCase();
    const usersCollectionRef = collection(db, "users");

    if (prompt === "") {
      setValues({ ...values, prompt: prompt, data: [] });
      return;
    }

    setValues({ ...values, isLoading: true });

    try {
      // Create a query with the specified prefix search and limit
      const q = query(
        usersCollectionRef,
        orderBy("username"),
        startAt(formattedPrompt),
        endAt(formattedPrompt + "\uf8ff"),
        limit(10)
      );

      // Execute the query
      const querySnapshot = await getDocs(q);

      // Process the results
      const filteredData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(filteredData);

      setValues({
        ...values,
        prompt: prompt,
        data: filteredData,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error querying collection: ", error);
      setValues({ ...values, isLoading: false });
    }
  };

  // functions
  const goBack = () => {
    navigation.goBack();
  };

  const submit = (name = values.prompt) => {
    // send workout to user
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
            placeholder="Search username"
            onChangeText={(value) => handleSearch(value)}
            value={values.prompt}
            onSubmitEditing={submit}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            focusable={false}
            keyboardAppearance="dark"
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
              submit(item.id); // submit current workout
            }}
          >
            <Image
              className="h-12 w-12 overflow-hidden rounded-[12px]"
              // source={{ uri: item.gif }}
            />
            <View className="h-16 justify-center">
              <Text className="text-white font-interSemiBold ">
                {item.username}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default SearchUser;
