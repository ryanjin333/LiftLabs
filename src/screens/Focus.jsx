import {
  View,
  Text,
  Dimensions,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

// redux imports
import { useDispatch, useSelector } from "react-redux";

const Focus = ({ navigation }) => {
  // redux
  const dispatch = useDispatch();
  const currentWorkout = useSelector((state) => state.exercise.currentWorkout);
  return (
    <FlatList
      className="bg-black"
      data={currentWorkout.plan}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        // actual screen
        <SafeAreaView className="h-screen w-screen p-6 bg-black">
          {/* main title and exit button */}
          <View className="flex-row justify-between">
            {/* title  */}
            <Text className="w-72 text-primary font-interBold text-3xl">
              {item.sets}
              <Text className="text-white font-interMedium text-2xl">
                {" "}
                sets of{"\n"}
              </Text>
              {item.title}
            </Text>
            {/* exit button */}
            <Pressable
              className="w-11 h-11 flex justify-start items-end "
              onPress={() => navigation.goBack()}
            >
              <Image
                className="h-6 w-6"
                source={require("../assets/exit.png")}
              />
            </Pressable>
          </View>

          {/* other information */}

          {/* exercise reps */}
          <Text className="text-primary  font-interBold text-3xl mt-10">
            {item.reps}
            <Text className="text-white font-interMedium text-2xl"> reps</Text>
          </Text>

          {/* exercise weight */}
          <Text className=" text-primary font-interBold text-3xl ">
            {item.weight}
            <Text className="text-white font-interMedium text-2xl"> lbs</Text>
          </Text>
        </SafeAreaView>
      )}
      snapToInterval={Dimensions.get("window").height}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Focus;
