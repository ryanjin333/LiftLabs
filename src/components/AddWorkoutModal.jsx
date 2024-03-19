import * as Haptics from "expo-haptics";
import { View, Text, Pressable, Image, Modal, TextInput } from "react-native";
import React, { useState } from "react";
import { BlurView } from "expo-blur";

const AddWorkoutModal = ({ modalVisible, setModalVisible }) => {
  const donePressed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View className="flex-1 items-center justify-end">
        <View className="rounded-[18px] overflow-hidden h-96 w-full justify-center items-center">
          <BlurView
            intensity={80}
            tint="dark"
            className="h-96 w-full items-center px-5"
          >
            {/* exit button */}
            <View className=" w-full h-6 mt-5 justify-center items-end">
              <Pressable
                className="w-6 h-6 "
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Image
                  className="h-6 w-6"
                  source={require("../assets/exit.png")}
                />
              </Pressable>
            </View>
            {/* title textfield */}
            <TextInput
              className="border-b border-[#2C2C2C] w-72 h-11 bg-transparent text-white px-4 mt-3"
              style={{ fontFamily: "Inter_400Regular" }}
              placeholderTextColor="#7C7C7C"
              placeholder="Title"
            />
            {/* optional image */}
            {/* done button */}
            <Pressable
              className="h-12 w-28 rounded-full justify-center items-center bg-[#F0F2A6] mt-40"
              onPress={donePressed}
            >
              <Text
                className="text-base"
                style={{ fontFamily: "Inter_600SemiBold" }}
              >
                Done
              </Text>
            </Pressable>
          </BlurView>
        </View>
      </View>
    </Modal>
  );
};

export default AddWorkoutModal;
