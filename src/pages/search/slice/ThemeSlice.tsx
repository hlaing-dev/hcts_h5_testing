import { createSlice } from "@reduxjs/toolkit";

// Define the ThemeState interface
interface ThemeState {
  data: boolean;
}

// Initialize the state based on the current system preference
const initialState: ThemeState = {
  data:
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches,
};

// Create the slice
export const ThemeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    // Toggle the theme manually
    switchTheme: (state) => {
      state.data = !state.data;
    },
    // Update the theme based on system preference
    setTheme: (state, action) => {
      state.data = action.payload;
    },
  },
});

// Actions generated from the slice
export const { switchTheme, setTheme } = ThemeSlice.actions;

// A selector to get the theme data from the state
export const selectTheme = (state: any) => state.theme.data;

// The reducer
export default ThemeSlice.reducer;

// Listener for system theme changes
export const initializeThemeListener = (dispatch: any) => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleChange = (event: MediaQueryListEvent) => {
    dispatch(setTheme(event.matches));
  };

  // Add the event listener
  mediaQuery.addEventListener("change", handleChange);

  // Optional: Remove the listener if necessary (e.g., on app unmount)
  return () => {
    mediaQuery.removeEventListener("change", handleChange);
  };
};
