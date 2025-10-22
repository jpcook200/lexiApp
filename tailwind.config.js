/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        custom: ['Satoshi-Regular'],
        bold: ['Satoshi-Bold'],
        medium: ['Satoshi-Medium'],
        light: ['Satoshi-Light'],
        black: ['Satoshi-Black'],
      },
      colors: {
        background: {
          light: "#f5fbffff", // light theme color
          dark: "#494949ff",  // dark theme color
        },
        secondary: {
          light: "#E5E7EB", // light theme color
          dark: "#3A3A3A",  // dark theme color
        },
        item: {
          light: "#e8e8e8ff", // light theme color
          dark: "#2C2C2C",  // dark theme color
        },
        shade: {
          light: "#dadadaff", // light theme color
          dark: "#242020ff",  // dark theme color
        },
        text: {
          light: "#000000", // light theme color
          dark: "#FFFFFF",  // dark theme color
        },
        subtext: {
          light: "#4B5563", // light theme color
          dark: "#D1D5DB",  // dark theme color
        },
        primary: '#1c95ffff',
        primaryDark: '#2889e3ff',
        primaryLight: '#ffffffff',
        accent: {
          light: "#F2B801",
          dark: "#F2B801",
        },
        border: {
          light: "#d1d1d1ff", // light theme color
          dark: "#686f79ff",  // dark theme color
        }
      },
    },
  },
  plugins: [],
};
