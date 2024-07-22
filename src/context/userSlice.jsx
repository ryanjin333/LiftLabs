import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Platform } from "react-native";
// Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  uid: null,
  username: "",
  fullName: "",
  weight: "lbs",
};

export const loadInfo = createAsyncThunk("user/loadInfo", async () => {
  try {
    const infoSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
    return infoSnap.data();
  } catch (error) {
    console.error(error);
  }
});

export const setInfo = createAsyncThunk(
  "user/setInfo",
  async ({ key, value }) => {
    try {
      const infoDoc = doc(db, "users", auth.currentUser.uid);
      await updateDoc(infoDoc, {
        [key]: value,
      });
      const infoSnap = await getDoc(infoDoc);
      return infoSnap.data();
    } catch (error) {
      console.error(error);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (currentUser) => {
    try {
      const { username, email, password } = currentUser;
      await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        username: username.toLowerCase(),
        fullName: "",
        pfp: "https://firebasestorage.googleapis.com/v0/b/gym-app-cf517.appspot.com/o/images%2Fpfp.jpg?alt=media&token=6864f471-9ca4-434d-a2c6-adc46f7f0b2c",
        bio: "",
        os: Platform.OS,
        weight: "lbs",
        followers: [],
        following: [],
        email: email,
        workouts: [],
        sharedWorkouts: [],
        pendingWorkouts: [],
      });
      return auth.currentUser.uid;
    } catch (error) {
      console.log("the error is:", error);
    }
  }
);

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

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // load
    builder.addCase(loadInfo.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(loadInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.showAlert = true;
      state.username = action.payload.username;
      state.fullName = action.payload.fullName;
      state.weight = action.payload.weight;
      state.alertType = "success";
      state.alertText = "Data loaded";
    });
    builder.addCase(loadInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.alertType = "danger";
      alertText = action.payload.msg;
    });
    // set info
    builder.addCase(setInfo.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(setInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.showAlert = true;
      state.username = action.payload.username;
      state.fullName = action.payload.fullName;
      state.weight = action.payload.weight;
      state.alertType = "success";
      state.alertText = "Data sent";
    });
    builder.addCase(setInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.alertType = "danger";
      alertText = action.payload.msg;
    });
    // register
    builder.addCase(registerUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.showAlert = true;
      state.uid = action.payload;
      state.alertType = "success";
      state.alertText = "User Created! Redirecting...";
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.alertType = "danger";
      alertText = action.payload.msg;
    });
    // login
    builder.addCase(loginUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.showAlert = true;
      state.uid = action.payload;
      state.alertType = "success";
      state.alertText = "Login Successful! Redirecting...";
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.alertType = "danger";
      alertText = action.payload.msg;
    });
  },
});

// Action creators are generated for each case reducer function
//export const {} = userSlice.actions;

export default userSlice.reducer;
