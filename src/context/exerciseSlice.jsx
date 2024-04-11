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
  plan: [],
  modalVisible: false,
};

export const fetchPlan = createAsyncThunk("workout/fetchPlan", async () => {
  // try {
  //   const workoutRef = doc(db, "users", auth.currentUser.uid);
  //   const workoutsSnap = await getDoc(workoutRef);
  //   return workoutsSnap.data();
  // } catch (error) {
  //   console.error(error);
  // }
});

export const createNewExercise = createAsyncThunk(
  "workout/createNewExercise",
  async (newWorkout) => {
    //     try {
    //       const newWorkoutFirestore = {
    //         workouts: arrayUnion(newWorkout),
    //       };
    //       const newWorkoutLocal = {
    //         workouts: newWorkout,
    //       };
    //       await updateDoc(
    //         doc(db, "users", auth.currentUser.uid),
    //         newWorkoutFirestore
    //       );
    //       return newWorkoutLocal;
    //     } catch (error) {
    //       console.error(error);
    //     }
  }
);

export const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    changeModalVisible(state, action) {
      state.modalVisible = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetch plan
    builder.addCase(fetchPlan.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPlan.fulfilled, (state, action) => {
      //state.workouts = action.payload.workouts;
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
      //state.workouts = [...state.workouts, action.payload];
    });
    builder.addCase(createNewExercise.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { changeDropdownTitle, changeModalVisible } =
  exerciseSlice.actions;

export default exerciseSlice.reducer;
