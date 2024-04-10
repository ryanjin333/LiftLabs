import React, { useState, useRef } from "react";
import { View, Text, Dimensions, ScrollView, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NewExercise = () => {
  const width = Dimensions.get("window").width;
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const data = [
    { id: 1, text: "Item 1" },
    { id: 2, text: "Item 2" },
    { id: 3, text: "Item 3" },
    // Add more items as needed
  ];

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % data.length;
    setCurrentIndex(nextIndex);
    scrollViewRef.current.scrollTo({ x: nextIndex * width, animated: true });
  };

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    scrollViewRef.current.scrollTo({ x: prevIndex * width, animated: true });
  };

  return (
    <SafeAreaView className="flex-1 bg-black px-6 items-center">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: width * data.length, flexGrow: 1 }}
        onScroll={(event) => {
          const contentOffsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(contentOffsetX / width);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
      >
        {data.map((item, index) => (
          <View
            key={item.id}
            style={{
              width,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 30, color: "white" }}>
              {item.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <Button title="Previous" onPress={handlePrevious} />
        <Button title="Next" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
};

export default NewExercise;
