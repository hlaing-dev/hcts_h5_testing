import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
  data: boolean;
}

// Parse settings and set default theme to dark
const movieData = JSON.parse(localStorage.getItem("movieAppSettings") || "{}");
if (movieData.themeMode === undefined) {
  movieData.themeMode = true; // Default to dark theme
}

const applyTheme = (isDark: boolean) => {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add("dark");
    sendEventToNative("dark");
  } else {
    root.classList.remove("dark");
    sendEventToNative("light");
  }
};

const sendEventToNative = async (theme: string) => {
  if (
    (window as any).webkit &&
    (window as any).webkit.messageHandlers &&
    (window as any).webkit.messageHandlers.jsBridge
  ) {
    (window as any).webkit.messageHandlers.jsBridge.postMessage({
      eventName: "themeMode",
      value: theme,
    });
  }
};

applyTheme(movieData.themeMode);

const initialState: ThemeState = {
  data: movieData.themeMode,
};

export const ThemeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    switchTheme: (state) => {
      state.data = !state.data;
    },
    setTheme: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { switchTheme, setTheme } = ThemeSlice.actions;
export const selectTheme = (state: any) => state.theme.data;
export default ThemeSlice.reducer;
