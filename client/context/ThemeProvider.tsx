import { createContext, ReactNode, useContext } from "react";

type ThemeContextType = {};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) throw new Error("useThemeContext must be inside ThemeProvider");

  return context;
};
