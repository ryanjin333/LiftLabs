import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import workoutReducer from "./workoutSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    workout: workoutReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       warnAfter: 100,
  //     },
  //   }),
});
