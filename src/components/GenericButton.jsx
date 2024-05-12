import * as Haptics from "expo-haptics";
import { Text, Pressable } from "react-native";

const GenericButton = ({ onPress, title, color }) => {
  const btnTapped = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };
  return (
    <Pressable
      className="h-16 w-full rounded-2xl justify-center items-center"
      style={{ backgroundColor: color }}
      onPress={btnTapped}
    >
      <Text className="text-base font-interSemiBold">{title}</Text>
    </Pressable>
  );
};

export default GenericButton;
