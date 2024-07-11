import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "@rneui/themed";
import uuid from "react-native-uuid";
// redux
import { useDispatch, useSelector } from "react-redux";

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
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { sendWorkout } from "../context/workoutSlice";

const initialState = {
  prompt: "",
  data: [],
  isLoading: false,
  showNoResult: false,
};

const SearchUser = ({ navigation }) => {
  const [values, setValues] = useState(initialState);

  // redux
  const dispatch = useDispatch();
  const currentWorkout = useSelector((state) => state.exercise.currentWorkout);

  // query functions
  const debouncedSearch = useRef(
    debounce(async (searchPrompt) => {
      if (searchPrompt === "") {
        setValues((prevValues) => ({
          ...prevValues,
          data: [],
          isLoading: false,
          showNoResult: false,
        }));
        return;
      }

      setValues((prevValues) => ({
        ...prevValues,
        isLoading: true,
        showNoResult: false,
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
            uid: doc.id,
            username: doc.data().username,
            fullName: doc.data().fullName,
            pfp: doc.data().pfp,
          }))
          .filter((user) => user.id !== auth.currentUser.uid);

        setValues((prevValues) => ({
          ...prevValues,
          data: filteredData,
          isLoading: false,
          showNoResult: true,
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

  // loading animations for pfp images
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
  };

  const submit = (uid, username) => {
    // create a confirmation alert
    Alert.alert("Send workout to " + username + "?", "", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          // create new workout and send to user
          const newWorkout = {
            id: uuid.v4(),
            title: currentWorkout.title,
            image: currentWorkout.image
              ? { uri: currentWorkout.image }
              : "../assets/React_Native_Logo.png", // use default image if custom image isn't provided
            plan: currentWorkout.plan,
            createdBy: currentWorkout.createdBy,
          };
          dispatch(sendWorkout({ newWorkout, uid }));
          goBack();
        },
      },
    ]);
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
              //onSubmitEditing={submit}
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
      {values.data.length !== 0 || values.prompt == "" ? (
        <FlatList
          data={values.data}
          keyExtractor={(item) => item.uid}
          keyboardShouldPersistTaps="always"
          ListFooterComponent={<View className=" h-96 w-full" />}
          renderItem={({ item }) => (
            // result item
            <Pressable
              className="flex-row items-center space-x-4"
              onPress={() => {
                submit(item.uid, item.username); // submit current workout
              }}
            >
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 99,
                  overflow: "hidden",
                }}
                source={{ uri: item.pfp }}
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
      ) : (
        <>
          {values.showNoResult && (
            <View className="flex-1 p-12 items-center">
              <Text className="text-white font-interSemiBold">
                No results for "{values.prompt}"
              </Text>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default SearchUser;
