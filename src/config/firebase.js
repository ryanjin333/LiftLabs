// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXB_2hehlutwr_xCgmUERvdu5pHF8zdtg",
  authDomain: "gym-app-67169.firebaseapp.com",
  projectId: "gym-app-67169",
  storageBucket: "gym-app-67169.appspot.com",
  messagingSenderId: "159413234381",
  appId: "1:159413234381:web:f6ff6ba58ccf984cbfd784",
  measurementId: "G-HNXPP8P9SX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
