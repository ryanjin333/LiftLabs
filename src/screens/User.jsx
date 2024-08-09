import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, Pressable, Linking } from "react-native";
import React, { useState, useEffect } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  where,
  collection,
} from "firebase/firestore";
import { auth, db, storage } from "../config/firebase";
import * as ImagePicker from "expo-image-picker";

import { useSelector, useDispatch } from "react-redux";
import {
  loadInfo,
  setFullNameSubmitBlocked,
  setInfo,
} from "../context/userSlice";

import Modal from "react-native-modal";

import { Image as LoadingImage } from "@rneui/themed";
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
  useSharedValue,
  useScrollViewOffset,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import { showMessage } from "react-native-flash-message";
import {
  AnimatedHeader,
  ChangeInfoModal,
  FormRow,
  GenericButton,
  LoadingGenericButton,
  ModalDoneButton,
  SettingsList,
} from "../components";
import { userToLoginScreenTransition } from "../context/animationSlice";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const initialState = {
  usernameModalVisible: false,
  fullNameModalVisible: false,
  username: "",
  fullName: "",
  email: "",
};

const User = ({ navigation }) => {
  // redux
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const userScreenVisible = useSelector(
    (state) => state.animation.userScreenVisible
  );

  // initial load
  useEffect(() => {
    setValues({
      ...values,
      email: auth.currentUser.email,
    });
  }, []);

  // variables
  const [values, setValues] = useState(initialState);

  // CONSTANTS
  const SECTIONS = [
    {
      title: "Personal",
      data: [
        { title: "Email", action: () => {}, text: values.email },
        {
          title: "Username",
          action: () => setValues({ ...values, usernameModalVisible: true }),
          text: user.username,
        },
        {
          title: "Full name",
          action: () => setValues({ ...values, fullNameModalVisible: true }),
          text: user.fullName,
        },
      ],
    },
    {
      title: "Units",
      data: [{ title: "Weight", action: () => {}, value: user.weight }],
    },
    {
      title: "Legal",
      data: [
        {
          title: "Privacy policy",
          action: () =>
            Linking.openURL(
              "https://daytrackernwss.github.io/index.html"
            ).catch((err) => console.error("Couldn't load page", err)),
        },
        {
          title: "Terms and conditions",
          action: () =>
            Linking.openURL(
              "https://daytrackernwss.github.io/termsAndConditions.html"
            ).catch((err) => console.error("Couldn't load page", err)),
        },
      ],
    },
    {
      title: "App Info",
      data: [{ title: "App version", action: () => {}, text: "v1.0" }],
    },
  ];

  // animations
  const offsetY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    offsetY.value = event.contentOffset.y;
  });

  const loadingOpacity = useSharedValue(1);
  useEffect(() => {
    loadingOpacity.value = withRepeat(
      withTiming(0.6, { duration: 700 }),
      -1,
      true
    );
  }, []);

  // firestore
  const [imageUrl, setImageUrl] = useState(null);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
        const pfpRef = ref(storage, dataSnap.data().pfp);
        const url = await getDownloadURL(pfpRef);

        setUsername(dataSnap.data().username);
        setImageUrl(url);
      } catch (error) {
        console.error("Error getting the image URL:", error);
      }
    };

    fetchData();
  }, []);

  const pickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Let user pick an image from the media library

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      // Create a reference to the file
      const imageRef = ref(
        storage,
        `images/${auth.currentUser.uid}/profiles/${Date.now()}.jpg`
      );

      // Convert image to byte array
      const response = await fetch(uri);
      const blob = await response.blob();

      // Send image to Storage
      const uploadTask = uploadBytesResumable(imageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // checks the percentage done
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error uploading the image:", error);
          Alert.alert("Upload Error", error.message);
        },
        async () => {
          // if successful, create a download url and set it both in firestore and locally
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const userDoc = doc(db, "users", auth.currentUser.uid);
          await setDoc(userDoc, { pfp: downloadURL }, { merge: true });

          setImageUrl(downloadURL);
        }
      );
    } catch (error) {
      console.error("Error uploading the image:", error);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut().then(() => {
        dispatch(userToLoginScreenTransition());
        setTimeout(() => {
          navigation.replace("Login");
        }, 800);
      });
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <>
      {userScreenVisible && (
        <>
          <AnimatedHeader offsetY={offsetY} title="User" />

          <Animated.ScrollView
            className="flex-1 bg-black"
            onScroll={scrollHandler}
          >
            <View className="h-24" />
            <SafeAreaView className="flex-1 bg-black px-6 pb-32 items-center justify-center">
              <View className="w-full flex-row justify-start">
                {/* pfp */}
                <AnimatedPressable
                  onPress={pickImage}
                  entering={FadeInUp.delay(50).duration(500).springify()}
                  exiting={FadeOutUp.delay(250).duration(500).springify()}
                >
                  <View className="absolute h-7 w-7 top-0 right-0 bg-[#515151a8] z-10 rounded-full justify-center items-center ">
                    <Image
                      className="h-4 w-4"
                      source={require("../assets/edit_icon.png")}
                    />
                  </View>
                  <LoadingImage
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                    source={{ uri: imageUrl }}
                    PlaceholderContent={
                      <Animated.View
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 99,
                          overflow: "hidden",
                          backgroundColor: "#2b2b2b",
                          opacity: loadingOpacity,
                        }}
                      />
                    }
                  />
                </AnimatedPressable>
              </View>
              <View className="w-full">
                {/* Personal info section */}
                <Animated.View
                  entering={FadeInUp.delay(100).duration(500).springify()}
                  exiting={FadeOutUp.delay(200).duration(500).springify()}
                >
                  <SettingsList data={SECTIONS[0]} />
                </Animated.View>

                {/* Units section */}
                <Animated.View
                  entering={FadeInUp.delay(150).duration(500).springify()}
                  exiting={FadeOutUp.delay(150).duration(500).springify()}
                >
                  <SettingsList data={SECTIONS[1]} />
                </Animated.View>

                {/* Legal section */}
                <Animated.View
                  entering={FadeInUp.delay(200).duration(500).springify()}
                  exiting={FadeOutUp.delay(100).duration(500).springify()}
                >
                  <SettingsList data={SECTIONS[2]} />
                </Animated.View>

                {/* App info */}
                <Animated.View
                  entering={FadeInUp.delay(250).duration(500).springify()}
                  exiting={FadeOutUp.delay(50).duration(500).springify()}
                >
                  <SettingsList data={SECTIONS[3]} />
                </Animated.View>
                {/* logout button */}
                <Animated.View
                  className="w-full mt-6"
                  entering={FadeInUp.delay(300).duration(500).springify()}
                  exiting={FadeOutUp.duration(500).springify()}
                >
                  <GenericButton
                    onPress={logout}
                    title="Logout"
                    color="#212121"
                    textColor="#ff1e1e"
                  />
                </Animated.View>
              </View>
            </SafeAreaView>
          </Animated.ScrollView>

          {/* individual modals */}
          <ChangeInfoModal
            values={values}
            setValues={setValues}
            name={"Username"}
            placeholder={user.username}
            isVisible={values.usernameModalVisible}
            value={values.username}
            modalValueType={"usernameModalVisible"}
            onPress={async () => {
              // INTEGRATE INTO REDUX
              try {
                const q = query(
                  collection(db, "users"),
                  where("username", "==", values.username.toLowerCase())
                );
                const usernameExists = await getDocs(q);
                if (usernameExists.empty) {
                  dispatch(
                    setInfo({
                      key: "username",
                      value: values.username.toLowerCase(),
                    })
                  );

                  showMessage({
                    message: "Username changed!",
                  });
                } else {
                  showMessage({
                    message: "Username already exists",
                    type: "danger",
                  });
                  return;
                }
              } catch (error) {
                console.error(error);
              }
            }}
          />
          <ChangeInfoModal
            values={values}
            setValues={setValues}
            name={"Full name"}
            placeholder={user.fullName}
            isVisible={values.fullNameModalVisible}
            value={values.fullName}
            modalValueType={"fullNameModalVisible"}
            onPress={() => {
              dispatch(setInfo({ key: "fullName", value: values.fullName }));
              showMessage({
                message: "Name changed!",
              });
            }}
          />
        </>
      )}
    </>
  );
};

export default User;
