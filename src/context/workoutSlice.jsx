import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Firebase
import { updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  workouts: [],
  sharedWorkouts: [],
  dropdownTitle: "All",
  modalVisible: false,
};

export const fetchWorkouts = createAsyncThunk(
  "workout/fetchWorkouts",
  async (userData) => {
    try {
      return userData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const createNewWorkout = createAsyncThunk(
  "workout/createNewWorkout",
  async (newWorkout) => {
    try {
      const newWorkoutFirestore = {
        workouts: arrayUnion(newWorkout),
      };
      await updateDoc(
        doc(db, "users", auth.currentUser.uid),
        newWorkoutFirestore
      );
    } catch (error) {
      console.error(error);
    }
  }
);

export const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    changeDropdownTitle(state, action) {
      state.dropdownTitle = action.payload;
    },
    changeModalVisible(state, action) {
      state.modalVisible = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetch workouts
    builder.addCase(fetchWorkouts.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchWorkouts.fulfilled, (state, action) => {
      state.workouts = action.payload.workouts;
      state.sharedWorkouts = action.payload.sharedWorkouts;
      state.isLoading = false;
    });
    builder.addCase(fetchWorkouts.rejected, (state, action) => {
      state.isLoading = false;
    });
    // create new workout
    builder.addCase(createNewWorkout.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(createNewWorkout.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(createNewWorkout.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { changeDropdownTitle, changeModalVisible } = workoutSlice.actions;

export default workoutSlice.reducer;
