import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import { BlurView } from "expo-blur";
import FormRow from "./FormRow";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSelector } from "react-redux";

// SUB COMPONENT
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ModalDoneButton = ({ isLoading, onPress, value }) => {
  // variables
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    if (value == "") {
      setBlocked(true);
    } else {
      setBlocked(false);
    }
  }, [value]);

  // animations
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.8, { damping: 20, stiffness: 200 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 200 });
  };
  return (
    <AnimatedPressable
      className="h-12 w-28 rounded-full justify-center items-center mt-10"
      onPress={() => {
        if (!blocked) {
          onPress();
        }
      }}
      onPressIn={() => {
        if (!blocked) {
          handlePressIn();
        }
      }}
      onPressOut={() => {
        if (!blocked) {
          handlePressOut();
        }
      }}
      style={[
        animatedStyle,
        { backgroundColor: !blocked ? "#F0F2A6" : "#474747" },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#000000" />
      ) : (
        <Text className="text-base font-interSemiBold">Done</Text>
      )}
    </AnimatedPressable>
  );
};

// MAIN COMPONENT
const ChangeInfoModal = ({
  values,
  setValues,
  name,
  placeholder,
  isVisible,
  value,
  modalValueType,
  onPress,
}) => {
  // redux
  const user = useSelector((state) => state.user);

  // functions
  const handleChange = (value, name) => {
    setValues({ ...values, [name]: value });
  };

  const resetModal = () => {
    setValues({
      ...values,
      [modalValueType]: false,
      username: "",
      fullName: "",
    });
  };
  const donePressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    onPress();
    resetModal();
  };
  return (
    <Modal
      style={{
        marginHorizontal: 0,
        marginTop: 200,
        justifyContent: "start",
        alignItems: "center",
      }}
      isVisible={isVisible}
      onBackdropPress={resetModal}
      backdropOpacity={0.5}
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
    >
      <View className="w-full px-8">
        <View className="w-full h-56  rounded-[18px] overflow-hidden">
          <BlurView
            intensity={60}
            tint="dark"
            className=" w-full h-56 items-center px-6 "
          >
            <Text className="text-white font-interMedium text-lg mt-3 mb-3">
              Change {name}
            </Text>
            <FormRow
              name={name}
              placeholder={placeholder}
              value={value}
              handleChange={handleChange}
              autoFocus={true}
            />

            <ModalDoneButton onPress={donePressed} value={value} />
          </BlurView>
        </View>
      </View>
    </Modal>
  );
};

export default ChangeInfoModal;
