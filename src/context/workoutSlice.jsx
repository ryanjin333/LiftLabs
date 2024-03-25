import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Firebase
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  uid: null,
};

export const getList = createAsyncThunk("user/getList", async (list) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return auth.currentUser.uid;
  } catch (error) {
    console.log(error);
  }
});

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (currentUser) => {
    const { email, password } = currentUser;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return auth.currentUser.uid;
    } catch (error) {
      console.log(error);
    }
  }
);
