import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

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
    // storage
    const storage = getStorage();

    // reference to the profile picture
    const pfpRef = ref(storage, "images/pfp.jpg");

    // get the download URL
    getDownloadURL(pfpRef)
      .then((url) => {
        setImageUrl(url);
      })
      .catch((error) => {
        console.error("Error getting the image URL:", error);
      });
  }, []);
  return (
    <>
      <AnimatedHeader offsetY={offsetY} title="User" />
      <Animated.ScrollView
        className="flex-1 bg-black"
        ref={scrollViewAnimatedRef}
      >
        <SafeAreaView className="flex-1 bg-black px-6 pb-32 items-center justify-center">
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} className="h-24 w-24" />
          ) : (
            <Text>Loading...</Text>
          )}
        </SafeAreaView>
      </Animated.ScrollView>
    </>
  );
};

export default User;
