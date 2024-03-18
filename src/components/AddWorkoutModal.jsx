import { View, Pressable, Image, Modal } from "react-native";
import React, { useState } from "react";
import { BlurView } from "expo-blur";

const AddWorkoutModal = ({ modalVisible, setModalVisible }) => {
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
            className="h-96 w-full items-center"
          >
            <View className=" w-full h-6 mt-5 justify-center items-end">
              <Pressable
                className="w-6 h-6 mr-5"
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Image
                  className="h-6 w-6"
                  source={require("../assets/exit.png")}
                />
              </Pressable>
            </View>
          </BlurView>
        </View>
      </View>
    </Modal>
  );
};

export default AddWorkoutModal;
