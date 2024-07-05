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
import React, { useState, useCallback, useRef } from "react";
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

import debounce from "lodash.debounce";

import Animated, {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
  ZoomIn,
  ZoomOut,
  useSharedValue,
  useScrollViewOffset,
  useAnimatedRef,
  useDerivedValue,
} from "react-native-reanimated";

const initialState = {
  prompt: "",
  data: [],
  isLoading: false,
};

const SearchUser = ({ navigation }) => {
  const [values, setValues] = useState(initialState);

  // redux
  const dispatch = useDispatch();

  const debouncedSearch = useRef(
    debounce(async (searchPrompt) => {
      if (searchPrompt === "") {
        setValues((prevValues) => ({
          ...prevValues,
          data: [],
          isLoading: false,
        }));
        return;
      }

      setValues((prevValues) => ({
        ...prevValues,
        isLoading: true,
      }));

      try {
        const formattedPrompt = searchPrompt.toLowerCase();
        const usersCollectionRef = collection(db, "users");

        const q = query(
          usersCollectionRef,
          orderBy("username"),
          startAt(formattedPrompt),
          endAt(formattedPrompt + "\uf8ff"),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const filteredData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            username: doc.data().username,
            fullName: doc.data().fullName,
            pfp: doc.data().pfp,
          }))
          .filter((user) => user.id !== auth.currentUser.uid);

        setValues((prevValues) => ({
          ...prevValues,
          data: filteredData,
          isLoading: false,
        }));
      } catch (error) {
        console.error("Error querying collection: ", error);
        setValues((prevValues) => ({
          ...prevValues,
          isLoading: false,
        }));
      }
    }, 500)
  ).current;

  const handleSearch = (value) => {
    setValues((prevValues) => ({
      ...prevValues,
      prompt: value,
    }));
    debouncedSearch(value);
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
          <View className="w-full">
            <TextInput
              className="border rounded-[18px] border-[#2C2C2C] w-full h-11 bg-transparent text-white px-4 font-inter"
              placeholderTextColor="#7C7C7C"
              placeholder="Search username"
              onChangeText={handleSearch}
              value={values.prompt}
              onSubmitEditing={submit}
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
              className="h-10 w-10 overflow-hidden rounded-[30px]"
              source={{ uri: item.pfp }}
            />
            <View className="h-16 justify-center">
              <Text className="text-white font-interSemiBold ">
                {item.username}
              </Text>
              {item.fullName !== "" && (
                <Text className="text-[#8f8f8f] font-inter text-xs">
                  {item.fullName}
                </Text>
              )}
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default SearchUser;
