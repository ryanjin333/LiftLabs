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
  modalVisible: false,
  exerciseName: "",
  currentWorkout: null,
};

export const fetchPlan = createAsyncThunk("exercise/fetchPlan", async () => {
  // try {
  //   const workoutRef = doc(db, "users", auth.currentUser.uid);
  //   return workoutsSnap.data();
  // } catch (error) {
  //   console.error(error);
  // }
});

export const createNewExercise = createAsyncThunk(
  "exercise/createNewExercise",
  async (newExercise, { getState }) => {
    try {
      const currentWorkout = getState().exercise.currentWorkout;
      const workouts = getState().workout.workouts;
      const localWorkout = {
        ...currentWorkout,
        plan: [...currentWorkout.plan, newExercise],
      };
      const newExerciseFirestore = {
        workouts: workouts.map((workout) => {
          if (workout.id === currentWorkout.id) {
            return {
              ...workout,
              plan: [...workout.plan, newExercise],
            };
          }
          return workout;
        }),
      };
      await updateDoc(
        doc(db, "users", auth.currentUser.uid),
        newExerciseFirestore
      );
      return localWorkout;
    } catch (error) {
      console.error(error);
    }
  }
);

export const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    changeModalVisible(state, action) {
      state.modalVisible = action.payload;
    },
    changeExerciseName(state, action) {
      state.exerciseName = action.payload;
    },
    changeCurrentWorkout(state, action) {
      state.currentWorkout = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetch plan
    builder.addCase(fetchPlan.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPlan.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(fetchPlan.rejected, (state, action) => {
      state.isLoading = false;
    });
    // create new exercise
    builder.addCase(createNewExercise.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(createNewExercise.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentWorkout = action.payload;
    });
    builder.addCase(createNewExercise.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { changeModalVisible, changeExerciseName, changeCurrentWorkout } =
  exerciseSlice.actions;

export default exerciseSlice.reducer;
