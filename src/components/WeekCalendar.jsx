import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";

// Redux imports
import { useSelector, useDispatch } from "react-redux";
import { setSelectedDate } from "../context/calendarSlice";

const WeekCalendar = () => {
  const [currentDate, setCurrentDate] = useState(moment());

  // Redux
  const dispatch = useDispatch();

  // Get the start of the week (Sunday)
  const startOfWeek = currentDate.clone().startOf("week"); // Start the week on Sunday
  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    startOfWeek.clone().add(i, "days")
  );

  // Handle date selection
  const selectDate = (date) => {
    setCurrentDate(date);
    dispatch(setSelectedDate(date.format("MMM 'YY")));
  };

  // Array of single-letter abbreviations for each day of the week
  const dayAbbreviations = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <View className="flex-row justify-between gap-x-1.5">
      {daysOfWeek.map((day, index) => (
        <TouchableOpacity
          key={index}
          className={`w-12 h-16 items-center justify-center rounded`}
          onPress={() => selectDate(day)}
        >
          {/* Shadow view for selected date */}
          <View
            className="w-11 h-16 justify-center items-center rounded-full"
            style={{
              width: 44,
              height: 64,
              borderRadius: 9999,
              shadowColor: "#ffffff",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.6,
              shadowRadius: 25,
              elevation: 25, // For Android
            }}
          >
            <LinearGradient
              // Button Linear Gradient
              colors={
                day.isSame(currentDate, "day")
                  ? ["#ffffffd2", "#ffffff48"]
                  : ["transparent"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-full h-full justify-center items-center rounded-full"
            >
              {/* The day */}
              <Text className="text-[#535353] text-xs font-interMedium">
                {dayAbbreviations[index]}
              </Text>
              {/* The date */}
              <Text
                className={`${
                  day.isSame(currentDate, "day") ? "text-black" : "text-white"
                } font-interSemiBold text-xl mt-1`}
              >
                {day.format("D")}
              </Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default WeekCalendar;
