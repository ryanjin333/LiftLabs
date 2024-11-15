import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Firebase
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import moment from "moment";

const initialState = {
  selectedDate: moment().format("dddd"),
  days: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
};

export const addWorkoutToDay = createAsyncThunk(
  "workout/addWorkoutToDay",
  async ({ day, id }) => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        [`days.${day}`]: arrayUnion(id),
      });
      console.log("created");
      return { day, id };
    } catch (error) {
      console.error(error);
    }
  }
);

export const deleteWorkoutFromDay = createAsyncThunk(
  "workout/deleteWorkoutFromDay",
  async ({ day }) => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        [`days.${day}`]: [],
      });
      console.log("deleted", day);
      return day;
    } catch (error) {
      console.error(error);
    }
  }
);

export const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
    setDays(state, action) {
      state.days = action.payload;
    },
  },
  extraReducers: (builder) => {
    // addWorkoutToDay
    builder.addCase(addWorkoutToDay.pending, (state, action) => {});
    builder.addCase(addWorkoutToDay.fulfilled, (state, action) => {
      // locally set the day added with workouts
      const { day, id } = action.payload;
      state.days[day.toLowerCase()].push(id);
    });
    builder.addCase(addWorkoutToDay.rejected, (state, action) => {
      console.log("an error happened for addWorkoutToDay");
    });
    // deleteWorkoutFromDay
    builder.addCase(deleteWorkoutFromDay.pending, (state, action) => {});
    builder.addCase(deleteWorkoutFromDay.fulfilled, (state, action) => {
      // locally delete the day added with workouts

      state.days[action.payload.toLowerCase()] = [];
    });
    builder.addCase(deleteWorkoutFromDay.rejected, (state, action) => {
      console.log("an error happened for deleteWorkoutFromDay");
    });
  },
});

export const { setSelectedDate, setDays } = calendarSlice.actions;

export default calendarSlice.reducer;
