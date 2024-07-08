import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../config/firebase";
import * as ImagePicker from "expo-image-picker";

import Animated, {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
  useSharedValue,
  useScrollViewOffset,
  useAnimatedRef,
  useDerivedValue,
} from "react-native-reanimated";
import { AnimatedHeader } from "../components";

const User = () => {
  // animations
  const scrollViewAnimatedRef = useAnimatedRef();
  const scrollViewOffsetY = useScrollViewOffset(scrollViewAnimatedRef);

  const offsetY = useDerivedValue(() =>
    parseInt(scrollViewOffsetY.value.toFixed(1))
  );

  // storage
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const pfpLinkSnap = await getDoc(
          doc(db, "users", auth.currentUser.uid)
        );
        const pfpRef = ref(storage, pfpLinkSnap.data().pfp);
        const url = await getDownloadURL(pfpRef);
        setImageUrl(url);
      } catch (error) {
        console.error("Error getting the image URL:", error);
      }
    };

    fetchImageUrl();
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

  return (
    <>
      <AnimatedHeader offsetY={offsetY} title="User" />
      <Animated.ScrollView
        className="flex-1 bg-black"
        ref={scrollViewAnimatedRef}
      >
        <View className="h-24" />
        <SafeAreaView className="flex-1 bg-black px-6 pb-32 items-center justify-center">
          {/* pfp - TODO: ADD ANIMATIONS WHEN TAPPED */}

          {imageUrl ? (
            <Pressable onPress={pickImage}>
              <View className="absolute h-7 w-7 top-0 right-0 bg-[#515151a8] z-10 rounded-full justify-center items-center">
                <Image
                  className="h-4 w-4"
                  source={require("../assets/edit_icon.png")}
                />
              </View>
              <Image
                source={{ uri: imageUrl }}
                className="h-24 w-24 overflow-hidden rounded-full"
              />
            </Pressable>
          ) : (
            <Text className="text-white">Loading...</Text>
          )}
        </SafeAreaView>
      </Animated.ScrollView>
    </>
  );
};

export default User;
