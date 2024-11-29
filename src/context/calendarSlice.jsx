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
  isLoading: false,
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

export const deleteWorkoutFromCalendar = createAsyncThunk(
  "workout/deleteWorkoutFromCalendar",
  async ({ id }, { getState, rejectWithValue }) => {
    try {
      // Get the current state
      const state = getState().calendar;
      const daysToUpdate = {};

      // Iterate through the days and find where the id exists
      Object.keys(state.days).forEach((day) => {
        if (state.days[day].includes(id)) {
          daysToUpdate[`days.${day}`] = []; // Mark the day to update in Firestore
        }
      });

      // If no days contain the id, exit early
      if (Object.keys(daysToUpdate).length === 0) {
        throw new Error("ID not found in any day's workout list.");
      }

      // Update Firestore
      await updateDoc(doc(db, "users", auth.currentUser.uid), daysToUpdate);
      console.log("deleted id:", id);
      return { id, daysToUpdate };
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
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

    // deleteWorkoutFromCalendar
    builder.addCase(deleteWorkoutFromCalendar.pending, (state, action) => {
      // Optionally set a loading state if needed
      state.isLoading = true;
    });

    builder.addCase(deleteWorkoutFromCalendar.fulfilled, (state, action) => {
      // Locally delete the workout from calendar
      const { id, daysToUpdate } = action.payload;

      // Iterate through the days to update and clear the arrays
      Object.keys(daysToUpdate).forEach((key) => {
        const day = key.split(".")[1]; // Extract day (e.g., "monday" from "days.monday")
        state.days[day] = []; // Clear the array for the given day
      });

      // Optionally reset loading state
      state.isLoading = false;
    });

    builder.addCase(deleteWorkoutFromCalendar.rejected, (state, action) => {
      console.log(
        "An error occurred for deleteWorkoutFromCalendar:",
        action.payload
      );

      // Optionally reset loading state and set error message
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { setSelectedDate, setDays } = calendarSlice.actions;

export default calendarSlice.reducer;
