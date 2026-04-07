import {
  amoledTheme,
  darkTheme,
  lightTheme,
  neonTheme,
  purpleTheme,
} from "@/constants/theme";
import { Theme } from "@/types/Theme";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type ThemeType = "light" | "dark" | "amoled" | "purple" | "neon";

type ThemeContextType = {
  theme: Theme;
  themeType: ThemeType;
  toggleTheme: (themeType: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const themes: Record<ThemeType, Theme> = {
  light: lightTheme,
  dark: darkTheme,
  amoled: amoledTheme,
  purple: purpleTheme,
  neon: neonTheme,
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeType, setThemeType] = useState<ThemeType>("light");

  const theme = useMemo(() => themes[themeType], [themeType]);

  const toggleTheme = (themeType: ThemeType) => {
    setThemeType(themeType);
  };

  return (
    <ThemeContext.Provider value={{ themeType, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) throw new Error("useThemeContext must be inside ThemeProvider");

  return context;
};
