import {
  View,
  Text,
  FlatList,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import { useState } from "react";
import { createNewWorkout } from "../context/workoutSlice";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import OpenAI from "openai";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

// Firebase imports
import { auth, db } from "../config/firebase";
import { doc, onSnapshot, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Self imports
import { RadialGradientImage, RoundedBlurView } from "../components";
import { IntroScene } from "../scenes";

// DUMMY VARIABLES
const muscleGroups = [
  { id: "0", name: "General" },
  { id: "1", name: "Chest" },
  { id: "2", name: "Back" },
  { id: "3", name: "Shoulders" },
  { id: "4", name: "Arms" }, // should include upper and lower arms
  { id: "5", name: "Legs" }, // should include upper and lower legs
  { id: "6", name: "Abs" }, // called waist in database
  { id: "7", name: "Cardio" },
  { id: "8", name: "Push" },
  { id: "9", name: "Pull" },
];

const initialState = {
  1: "Intermediate", // level
  2: "General fitness", // goals
  3: "30 min to 1 hour", // length
  4: 18, // age
  5: "Male oriented", // gender
  6: 180, // weight
  7: 175, // height
};

const AIWorkoutCreator = ({ navigation }) => {
  const [responses, setResponses] = useState(initialState);

  // redux
  const dispatch = useDispatch();

  const generateWorkoutPressed = async (mainMuscle) => {
    // DUMMY VARIABLES
    const numberOfExercises = 6;
    const minuteBreak = 1;
    const secondBreak = 0;
    const weightSetting = "lbs"; // get from context

    // FOR WHEN UR CREATING A WORKOUT
    const exerciseRef = doc(db, "exercises", "allExercises");
    const exerciseSnap = await getDoc(exerciseRef);
    console.log("sending");

    if (exerciseSnap.exists()) {
      console.log("sent");

      const exercises = exerciseSnap.data().exercises;

      // Format exercises

      // Group exercises by `mainMuscle` put inside a useEffect once using fr
      const groupedByMainMuscle = exercises.reduce((groups, exercise) => {
        const muscle = exercise.mainMuscle || "Other"; // Default to "Other" if no `mainMuscle`
        if (!groups[muscle]) {
          groups[muscle] = [];
        }
        groups[muscle].push(exercise.name);
        return groups;
      }, {});

      // Create a relationship where key is name and value is gif so that gifs can easily be found
      const nameToGifMap = exercises.reduce((map, exercise) => {
        map[exercise.name] = exercise.gif;
        return map;
      }, {});

      // Send to AI
      const openai = new OpenAI({
        apiKey:
          "sk-FD53WCJTLHLbaQNNet1BskPDUzmwdlV8seuxjY5r1DT3BlbkFJLqkSrl8fpcJhY982lNT0xIXd0Uxuod8wObhrlOAwkA",
      });
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `
              [no prose]
              [Output only JSON]
              Here is a list of ${mainMuscle} exercises: ${groupedByMainMuscle[mainMuscle]}. Please recommend ${numberOfExercises} effective exercises
               who is a ${responses[4]} year old ${responses[6]}kg ${responses[7]}cm ${responses[1]} gym goer. The exercises must be a ${responses[5]}
               workout and focuses on ${responses[2]}. Only provide the name already provided in the list word for word (you can only call the key name), recommended sets and reps, weight in ${weightSetting} not
               including the unit of measurement in the parameters all in lowercase and only have it in intervals of 5s or 10s, absolutely nothing else. You may only display it in this following format:
               [
                {
                  "name": "barbell front squat",
                  "sets": 3,
                  "weight": 22,
                  "reps": 15
                },
                {
                  "name": "dumbbell goblet squat",
                  "sets": 2,
                  "weight": 15,
                  "reps": 10
                }
              ].
              The workout should be ${responses[3]} but take into account a ${minuteBreak} minute ${secondBreak} second break in between each set.`,
            },
          ],
        });

        // Combine the plan for workout creation
        const aiOutput = JSON.parse(completion.choices[0].message.content);

        const plan = aiOutput.map((exercise) => ({
          id: uuid.v4(),
          title: exercise.name,
          gif: nameToGifMap[exercise.name], // Match the gif based on the exercise name
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
        }));
        console.log(plan);

        // TODO!!!!!!!!!!!!!!!!!!!!!!!!!: if a plan is undefined run AI again

        // Create the workout

        const newWorkout = {
          id: uuid.v4(),
          title: mainMuscle,
          image: require("../../assets/icon.png"),
          plan: plan,
          createdBy: "AI",
        };
        dispatch(createNewWorkout(newWorkout));

        navigation.goBack();
      } catch (error) {
        console.error("OpenAI API error:", error);
      }
      console.log("completed");
    }
  };

  // grid adjustments
  const padding = 31 * 2; // Left + right
  const margin = 2 * 2; // Margins between items in a row
  const screenWidth = Dimensions.get("window").width;
  const itemWidth = (screenWidth - padding - margin) / 3;

  return (
    // <SafeAreaView className="flex-1 bg-black items-center">
    //   <View className="w-full pt-12 px-6">
    //     <View className=" flex-row space-x-4">
    //       <Text className="text-white font-interBold text-4xl">LiftLab AI</Text>
    //       <Image
    //         className="w-8 h-8"
    //         source={require("../assets/sparkles.png")}
    //       />
    //     </View>

    //     <Text className="text-subtitle mb-12 font-interMedium ">
    //       Select all that apply
    //     </Text>
    //   </View>

    //   <View className="flex-row flex-wrap px-6 ">
    //     {muscleGroups.map((item, index) => (
    //       // individual workout selection views
    //       <RoundedBlurView
    //         key={item.id}
    //         className={`rounded-[20px] m-0.5 border border-[#1C1B1B]`}
    //         style={{ width: itemWidth, height: itemWidth }}
    //         containerClassName="p-3 justify-between"
    //       >
    //         {/* top half of the selection view */}
    //         <View className="flex-row justify-between">
    //           {/* apply shadowing to the radial gradient */}
    //           <View
    //             style={{
    //               borderRadius: 9999,
    //               shadowColor: "#858585",
    //               shadowOffset: { width: 0, height: 5 },
    //               shadowOpacity: 0.6,
    //               shadowRadius: 15,
    //               elevation: 15, // For Android
    //             }}
    //           >
    //             <RadialGradientImage
    //               image={require("../assets/body.png")}
    //               gradientSize="9"
    //               imageSize="6"
    //             />
    //           </View>

    //           <Image
    //             className="w-5 h-5"
    //             source={require("../assets/checkmark.png")}
    //           />
    //         </View>

    //         {/* bottom half of the selection view */}
    //         <Text className="text-white font-interMedium text-sm">
    //           {item.name}
    //         </Text>
    //       </RoundedBlurView>
    //     ))}
    //   </View>
    // </SafeAreaView>
    <IntroScene />
  );
};

export default AIWorkoutCreator;
