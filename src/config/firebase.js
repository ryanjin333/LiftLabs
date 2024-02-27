// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAKaCr2pMgCwOgzgOH83JffFiOVHFtDDI",
  authDomain: "gym-app-cf517.firebaseapp.com",
  projectId: "gym-app-cf517",
  storageBucket: "gym-app-cf517.appspot.com",
  messagingSenderId: "811062416555",
  appId: "1:811062416555:web:5dd0fa08f0381adcadd3ee",
  measurementId: "G-RKB9Y8BE61",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
