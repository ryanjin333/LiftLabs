import { View, Text } from "react-native";
import { IntroScene } from "../scene";

import React from "react";

const Intro = () => {
  return (
    <View className="bg-black flex-1">
      <View
        className="bg-white h-10 w-10 absolute bottom-96 left-32"
        position={[5, 5, 5]}
      />
      <IntroScene />
    </View>
  );
};

export default Intro;
