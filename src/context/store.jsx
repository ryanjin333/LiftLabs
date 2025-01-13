import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import workoutReducer from "./workoutSlice";
import exerciseReducer from "./exerciseSlice";
import animationReducer from "./animationSlice";
import calendarReducer from "./calendarSlice";
import preferenceSlice from "./preferenceSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    workout: workoutReducer,
    exercise: exerciseReducer,
    animation: animationReducer,
    calendar: calendarReducer,
    preference: preferenceSlice,
  },
});
