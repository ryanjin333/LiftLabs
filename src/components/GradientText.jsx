import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

const GradientText = ({
  text,
  colors,
  className,
  orientation = "horizontal",
}) => {
  const gradientDirection =
    orientation === "horizontal"
      ? { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } }
      : { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };

  return (
    <MaskedView
      maskElement={<Text className={`${className} text-black`}>{text}</Text>}
    >
      <LinearGradient
        colors={colors}
        start={gradientDirection.start}
        end={gradientDirection.end}
      >
        <Text className={`${className} opacity-0`}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
