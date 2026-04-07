import { useThemeContext } from "@/context/ThemeProvider";

export const useAppTheme = () => {
  const { theme } = useThemeContext();
  const scale = 1;

  return { theme, scale };
};
