import {
  createTheme,
  PaletteMode,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { getThemePalette, globalTheme } from "../styles/globalTheme";

type ThemeContextType = {
  toggleMode: () => void;
};

export const ThemeContext = React.createContext<ThemeContextType>({
  toggleMode: () => {},
});

export const ThemeProvider = ({ children }: { children?: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode === "light" || savedMode === "dark") return savedMode;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const toggleMode = () =>
    setMode((currentMode) => (currentMode === "light" ? "dark" : "light"));

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme(globalTheme, {
        palette: getThemePalette(mode),
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={{ toggleMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
