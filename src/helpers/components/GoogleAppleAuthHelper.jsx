import { getDoc, doc } from "firebase/firestore";
import { signInWithCredential } from "firebase/auth";

import { auth, db } from "../../config/firebase";
import { registerUser, loginUser } from "../../context/userSlice";

// Function to generate a random username
const generateUsername = (email) => {
  if (!email) return null;

  // Extract the name part of the email
  const namePart = email.split("@")[0];

  // Generate a random number to append to the username
  const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

  // Combine the name part with a random number
  const randomUsername = `${namePart}_${randomNum}`;

  return randomUsername;
};

const handleSocialAuth = async (credential, dispatch) => {
  const result = await signInWithCredential(auth, credential);
  const user = result.user;

  // LOGGED IN

  // Check if user exists in Firestore
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    // User already exists, log in
    console.log("User exists, logging in...");
    const currentUser = {
      email: user.email,
      password: "SocialAuth",
      isEmailSignIn: false,
    };

    dispatch(loginUser(currentUser)); // Use loginUser here
  } else {
    // Unique username creation
    const username = generateUsername(user.email);

    const currentUser = {
      username: username,
      email: user.email,
      password: "SocialAuth",
      isEmailSignIn: false,
    };

    // Dispatch the registerUser thunk
    dispatch(registerUser(currentUser));
  }
};

const GoogleAppleAuthHelper = { handleSocialAuth };
// Default export of the generateUsername function
export default GoogleAppleAuthHelper;
