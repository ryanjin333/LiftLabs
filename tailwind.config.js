/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      interThin: ["Inter-Thin"],
      interExtraLight: ["Inter_ExtraLight"],
      interLight: ["Inter_Light"],
      inter: ["Inter-Regular"],
      interMedium: ["Inter-Medium"],
      interSemiBold: ["Inter-SemiBold"],
      interBold: ["Inter-Bold"],
      interExtraBold: ["Inter-ExtraBold"],
      interBlack: ["Inter-Black"],
    },
    colors: {
      primary: "#F0F2A6",
      white: "#fff",
      black: "#000",
    },
  },
  plugins: [],
};
