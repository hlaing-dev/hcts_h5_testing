/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Enable dark mode with a class

  theme: {
    extend: {
      colors: {
        primary: "#BB86FC",
        secondary: "#03DAC6",
        background: "white",
        header: "#282828",
        footer: "#282828",
        text: "#E0E0E0",
        accent: "#FFAB40",
        selected: "#FF5722",
        unselected: "#4B5563",
        player: "black",
        playerNavigator: "rgb(254, 88, 181)",
        source: "#00000014",
        sourceBack: "white",
        episodeSelected: "#00000014",
        mainColor: "#fe58b5",
        unselectedColor: "rgba(255, 255, 255, 0.8)",
        commentInput: "rgba(32, 32, 34, 0.9)",
        commentIcon: "rgba(255, 255, 255, 0.6)",
        channel: "#522B0F",
        channelSecondary: "#522B0F99",
      },
      fontSize: {
        xs: "0.75rem", // Extra small text
        sm: "0.875rem", // Small text
        base: "1rem", // Base size (typically for body text)
        lg: "1.125rem", // Large text
        xl: "1.25rem", // Extra large
        "2xl": "1.5rem", // Heading levels or special text
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      // backgroundImage: {
      //   noplay: "url('./src/assets/noplay.svg')",
      // },
    },
  },
  plugins: [],
};
