import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

const GradientText = ({ text, colors, className }) => {
  return (
    <MaskedView
      maskElement={<Text className={`${className} text-black`}>{text}</Text>}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text className={`${className} opacity-0`}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
