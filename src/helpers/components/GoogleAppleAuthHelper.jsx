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

const GoogleAppleAuthHelper = { generateUsername };
// Default export of the generateUsername function
export default GoogleAppleAuthHelper;
