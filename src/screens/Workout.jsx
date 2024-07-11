import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import { changeModalVisible } from "../context/exerciseSlice";

// reanimated imports
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutDown,
  useSharedValue,
  useScrollViewOffset,
  useAnimatedRef,
  useDerivedValue,
} from "react-native-reanimated";

import {
  ExerciseRow,
  OutlineButton,
  OutlineButtonCircle,
  AddExerciseModal,
  FocusStartButton,
  AnimatedHeader,
} from "../components";

const Workout = ({ route, navigation }) => {
  const { title, plan } = route.params;

  // redux
  const dispatch = useDispatch();
  const currentWorkout = useSelector((state) => state.exercise.currentWorkout);
  // animations
  const scrollViewAnimatedRef = useAnimatedRef();
  const scrollViewOffsetY = useScrollViewOffset(scrollViewAnimatedRef);

  const offsetY = useDerivedValue(() =>
    parseInt(scrollViewOffsetY.value.toFixed(1))
  );
  return (
    <>
      <AnimatedHeader offsetY={offsetY} title={title} />
      <Animated.ScrollView
        className="flex-1 bg-black"
        ref={scrollViewAnimatedRef}
      >
        <View className="h-24" />
        <SafeAreaView className="flex-1 bg-black px-6 pb-40 items-center">
          {/* button bar */}
          <View className="w-full flex-row justify-between mt-6">
            <View className="flex-row space-x-1">
              <View>
                <OutlineButtonCircle
                  image={"back_chevron"}
                  onPress={() => navigation.goBack()}
                />
              </View>
              <View>
                <OutlineButton
                  title="Share"
                  onPress={() => navigation.navigate("SearchUser")}
                />
              </View>
            </View>

            <OutlineButton
              title="+ Add"
              onPress={() => dispatch(changeModalVisible(true))}
            />
          </View>

          {/* exercise list */}
          {currentWorkout.plan.length == 0 ? (
            <View className="flex-1 justify-center mt-20">
              <Text className="text-center text-white w-44 font-inter">
                Tap <Text className="font-interBold">Add</Text> to create a new
                exercise
              </Text>
            </View>
          ) : (
            <View className="w-full mt-6 rounded-[18px]">
              <FlatList
                scrollEnabled={false}
                className="rounded-[18px] "
                data={currentWorkout.plan ? currentWorkout.plan : plan}
                renderItem={({ item }) => <ExerciseRow plan={item} />}
                keyExtractor={(item) => item.id}
              />
            </View>
          )}
          <AddExerciseModal />
        </SafeAreaView>
      </Animated.ScrollView>

      <FocusStartButton />
    </>
  );
};

export default Workout;
