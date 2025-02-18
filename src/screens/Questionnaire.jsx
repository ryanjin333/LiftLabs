import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  GradientBlur,
  GradientButton,
  RoundedBlurView,
  ScrollSelector,
} from "../components";

import { LinearGradient } from "expo-linear-gradient";

import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { Picker } from "@react-native-picker/picker";
import { submitData } from "../context/userSlice";

const initialState = {
  1: "Intermediate", // level
  2: "General fitness", // goals
  3: "30 min to 1 hour", // length
  4: 18, // age
  5: "Male oriented", // gender
  6: 180, // weight
  7: 175, // height
};

const Questionnaire = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState(initialState);

  // react native navigation
  const navigation = useNavigation();

  // redux
  const dispatch = useDispatch();

  // insets
  const insets = useSafeAreaInsets();

  const questions = [
    {
      id: 1,
      text: "First, what is your fitness level",
      type: "multipleChoice",
      options: [
        { title: "Beginner", subtitle: "0 to 1 year" },
        { title: "Intermediate", subtitle: "1 to 3 years" },
        { title: "Advanced", subtitle: "3+ years" },
      ],
    },
    {
      id: 2,
      text: "Next, what is your fitness goal",
      type: "multipleChoice",
      options: [
        { title: "Weight loss", subtitle: "burn calories" },
        { title: "Muscle gain", subtitle: "build strength" },
        { title: "General", subtitle: "improve overall health" },
      ],
    },
    {
      id: 3,
      text: "How long do you plan to work out",
      type: "multipleChoice",
      options: [
        { title: "Under 30 min", subtitle: "beginner friendly" },
        { title: "30 min to 1 hour", subtitle: "respectable amount" },
        { title: "1+ hours", subtitle: "built different" },
      ],
    },
    { id: 4, text: "What is your age", type: "number" },
    {
      id: 5,
      text: "Select a workout type",
      type: "multipleChoice",
      options: [
        { title: "Male oriented", subtitle: "" },
        { title: "Female oriented", subtitle: "" },
        { title: "Mix of both", subtitle: "" },
      ],
    },
    { id: 6, text: "How heavy are you in kg", type: "number" },
    { id: 7, text: "How tall are you in cm", type: "number" },
  ];

  const handleAnswer = (answer) => {
    setResponses((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer,
    }));
  };

  const finishPressed = async () => {
    console.log(responses);
    dispatch(submitData(responses));
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.type === "number") {
      return (
        <>
          <View
            className={`absolute left-0 right-0 z-0`}
            style={{
              top: insets.top,
              bottom: insets.bottom,
            }}
          >
            <ScrollSelector handleAnswer={handleAnswer} />
          </View>
        </>
      );
    } else if (currentQuestion.type === "multipleChoice") {
      return (
        // <FlatList
        //   data={currentQuestion.options}
        //   renderItem={({ item }) => (
        //     <TouchableOpacity
        //       className="w-full h-16 mb-6 rounded-full justify-center items-center bg-black border border-[#363636]"
        //       onPress={() => handleAnswer(item)}
        //     >
        //       <Text className=" text-white font-interMedium text-lg">
        //         {item}
        //       </Text>
        //     </TouchableOpacity>
        //   )}
        //   keyExtractor={(item, index) => index.toString()}
        // />
        <View className="flex-row flex-wrap -mt-24  justify-center ">
          {currentQuestion.options.map((item, index) => (
            // individual workout selection views
            <Pressable onPress={() => handleAnswer(item.title)} key={index}>
              <LinearGradient
                colors={["#3d3d3d", "#1b1b1b"]} // Customize gradient colors
                locations={[0, 0.2]}
                start={[0, 0]}
                end={[0, 1]} // Top to bottom gradient
                className="rounded-[20px] m-0.5 p-[1px]"
              >
                <View
                  key={item}
                  className="rounded-[20px] bg-[#181818] justify-between p-4 " // Transparent border to retain gradient
                  style={{ width: 180, height: 180 }}
                >
                  {/* Title */}
                  <Text className="text-[#ffffff] font-interSemiBold text-lg">
                    {item.title}
                  </Text>

                  {/* Subtitle */}
                  <Text className=" text-subtitle font-interMedium">
                    {item.subtitle}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          ))}
          {/* Dummy View if number of items is odd */}
          {currentQuestion.options.length % 2 !== 0 && (
            <View
              style={{ width: 180, height: 180 }}
              className="m-0.5 opacity-0"
            />
          )}
        </View>
      );
    } else {
      return <Text>Unknown question type</Text>;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black px-6 justify-between ">
      <View className=" z-10" pointerEvents="none">
        <View className="w-full items-center bg-black">
          <Text className="text-white font-interBold mt-10  text-4xl ">
            {questions[currentQuestionIndex].text}
          </Text>
        </View>
        {questions[currentQuestionIndex].type == "number" && (
          <View pointerEvents="none">
            <GradientBlur className="w-full h-48 " direction="fromBottom" />
          </View>
        )}
      </View>

      {renderQuestion()}

      {/* navigation buttons */}
      <View>
        {questions[currentQuestionIndex].type == "number" && (
          <View pointerEvents="none">
            <GradientBlur className="w-full h-48" direction="fromTop" />
          </View>
        )}
        <View className=" flex-row justify-between bg-black">
          {/* go back button */}
          <LinearGradient
            colors={["#4e4e4e", "#000000"]} // Customize gradient colors
            locations={[0, 0.4]}
            start={[0, 0]}
            end={[0, 1]} // Top to bottom gradient
            className="rounded-full p-[1px] mb-10"
          >
            <TouchableOpacity
              onPress={() =>
                currentQuestionIndex > 0 &&
                setCurrentQuestionIndex(currentQuestionIndex - 1)
              }
              disabled={currentQuestionIndex === 0}
              className="bg-black h-16 w-16 rounded-full justify-center items-center"
            >
              <Image
                source={require("../assets/reverse.png")}
                className="h-7 w-7"
              />
            </TouchableOpacity>
          </LinearGradient>
          {/* next button */}
          {/* <TouchableOpacity
            onPress={() =>
              currentQuestionIndex < questions.length - 1
                ? setCurrentQuestionIndex(currentQuestionIndex + 1)
                : finishPressed()
            }
            className="bg-[#272727] h-16 w-48 rounded-full justify-center items-center"
          >
            <Text className=" text-white font-interMedium text-lg">
              {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
            </Text>
          </TouchableOpacity> */}

          {/* gradient next button */}
          <View className=" mb-5 w-48">
            <GradientButton
              title={
                currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"
              }
              onPress={() =>
                currentQuestionIndex < questions.length - 1
                  ? setCurrentQuestionIndex(currentQuestionIndex + 1)
                  : finishPressed()
              }
            />
          </View>

          {/* dummy button */}

          <View className="h-16 w-16" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#000000",
    padding: 8,
    marginBottom: 20,
    borderRadius: 5,
  },
  option: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default Questionnaire;
