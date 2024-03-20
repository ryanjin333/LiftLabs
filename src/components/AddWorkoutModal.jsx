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
        {/* opaque background */}
        {modalVisible && (
          <Pressable
            className="absolute top-0 bottom-0 left-0 right-0 bg-black opacity-30"
            onPress={() => setModalVisible(!modalVisible)}
          />
        )}
        {/* modal view */}
        <View className="rounded-[18px] overflow-hidden h-72 w-full justify-center items-center">
          <BlurView
            intensity={60}
            tint="dark"
            className="h-72 w-full items-center px-5"
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
            <View className="flex-row justify-between w-full">
              {/* optional image */}
              <Pressable onPress={() => console.log("tapped")}>
                <View className="absolute h-7 w-7 top-0 right-0 bg-[#515151a8] z-10 rounded-full justify-center items-center">
                  <Image
                    className="h-4 w-4"
                    source={require("../assets/edit_icon.png")}
                  />
                </View>
                <Image
                  className="h-16 w-16 rounded-[18px] mt-2 mr-2 overflow-hidden"
                  source={require("../assets/React_Native_Logo.png")}
                />
              </Pressable>
              {/* title textfield */}
              <TextInput
                className="border-b border-[#2C2C2C] w-72 h-11 bg-transparent text-white px-4 mt-3"
                style={{ fontFamily: "Inter_400Regular" }}
                placeholderTextColor="#7C7C7C"
                placeholder="Title"
              />
            </View>
            {/* done button */}
            <Pressable
              className="h-12 w-28 rounded-full justify-center items-center bg-[#F0F2A6] mt-16"
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
