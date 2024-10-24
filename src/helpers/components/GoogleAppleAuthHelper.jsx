import { getRandomBytesAsync } from "expo-random";

// Utility function to generate a random number
const getRandomNumber = async (length = 4) => {
  const bytes = await getRandomBytesAsync(length);
  return Array.from(bytes)
    .map((byte) => (byte % 10).toString())
    .join("");
};

// Function to generate a random username
const generateUsername = async (email) => {
  if (!email) return null;

  // Extract the name part of the email
  const namePart = email.split("@")[0];

  // Generate a random number to append to the username
  const randomNum = await getRandomNumber();

  // Combine the name part with a random number
  const randomUsername = `${namePart}_${randomNum}`;

  return randomUsername;
};

const GoogleAppleAuthHelper = { getRandomNumber, generateUsername };
// Default export of the generateUsername function
export default GoogleAppleAuthHelper;
