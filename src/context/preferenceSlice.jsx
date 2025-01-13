import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Firebase
import { updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const initialState = {
  preferences: {
    level: "",
    goal: "",
    duration: "",
    age: 0,
    type: "",
    weight: 0,
    height: 0,
  },
  isLoading: false,
};

export const loadPreference = createAsyncThunk(
  "preference/loadPreference",
  async (preferenceDoc) => {
    try {
      return preferenceDoc;
    } catch (error) {
      console.error("Error submitting user data:", error);
      throw error; // Re-throw the error to handle it in the caller
    }
  }
);

export const preferenceSlice = createSlice({
  name: "preference",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // load info
    builder.addCase(loadPreference.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadPreference.fulfilled, (state, action) => {
      state.isLoading = false;
      const localPreference = state.preferences;
      const firestorePreference = action.payload;

      // Loop through the keys of firestorePreference and assign values to localPreference
      Object.keys(firestorePreference).forEach((key) => {
        localPreference[key] = firestorePreference[key];
      });
    });
    builder.addCase(loadPreference.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const {} = preferenceSlice.actions;

export default preferenceSlice.reducer;
