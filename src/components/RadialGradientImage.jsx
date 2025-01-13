import { View, Image } from "react-native";
import React from "react";
import { RadialGradient } from "react-native-gradients";

const RadialGradientImage = ({
  startColor = "#000000",
  endColor = "#535353",
  gradientSize,
  imageSize,
  image,
}) => {
  const colorList = [
    { offset: "0%", color: startColor, opacity: "1" },

    { offset: "100%", color: endColor, opacity: "1" },
  ];
  return (
    <View
      className={`w-${gradientSize} h-${gradientSize} justify-center items-center rounded-full overflow-hidden`}
    >
      <RadialGradient x="50%" y="50%" rx="50%" ry="50%" colorList={colorList} />
      <Image
        className={`absolute w-${imageSize} h-${imageSize}`}
        source={image}
      />
    </View>
  );
};

export default RadialGradientImage;
