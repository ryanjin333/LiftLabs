import React, { useState, useRef, useEffect } from "react";
import { View, Text, FlatList, Dimensions, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

const { height } = Dimensions.get("window");
const ITEM_SIZE = 60; // Size of each item (height)
const SPACING = 10; // Spacing between items

const ScrollSelector = ({ handleAnswer }) => {
  const [selectedItem, setSelectedItem] = useState(1); // Track the selected item
  const flatListRef = useRef(null); // Reference to the FlatList

  const numbers = Array.from({ length: 1000 }, (_, i) => i); // Array of numbers

  const onScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / (ITEM_SIZE + SPACING));
    if (index !== selectedItem) {
      setSelectedItem(index); // Update the selected item index
    }
  };

  useEffect(() => {
    // Trigger haptic feedback when selectedItem changes, also change the answer
    handleAnswer(selectedItem);
    Haptics.selectionAsync();
  }, [selectedItem]);

  const renderItem = ({ item, index }) => {
    const isSelected = index === selectedItem; // Check if the item is selected

    return (
      <View className="">
        <View className="flex-row items-center justify-center h-[60px] my-[5px] rounded-md px-4">
          <Text
            className={`text-3xl font-interSemiBold ${
              isSelected ? "text-white" : "text-[#636363]"
            }`}
          >
            {item}
          </Text>
        </View>
        {/* {isSelected && (
          <Text className="absolute right-[-70px] top-1/2 -translate-y-1/2 text-lg font-medium text-gray-600">
            years old
          </Text>
        )} */}
      </View>
    );
  };

  return (
    <View className="flex-1 justify-center items-center">
      <FlatList
        ref={flatListRef}
        data={numbers}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_SIZE + SPACING} // Center each item
        decelerationRate="normal"
        onScroll={onScroll} // Update during scrolling
        scrollEventThrottle={16} // Smooth updates (16ms for ~60fps)
        contentContainerStyle={{
          paddingTop: height / 2 - ITEM_SIZE / 2,
          paddingBottom: height / 4 - ITEM_SIZE / 2,
        }}
        renderItem={renderItem}
      />
      {/* <Text style={styles.selectedLabel}>
        Selected: {numbers[selectedItem]}
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: ITEM_SIZE,
    width: ITEM_SIZE,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: SPACING / 2,
    borderRadius: 10,
  },
  selectedItemContainer: {
    backgroundColor: "#add8e6", // Highlight color for selected item
  },
  number: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  selectedNumber: {
    color: "#000", // Change color for selected number
  },
  selectedLabel: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default ScrollSelector;
