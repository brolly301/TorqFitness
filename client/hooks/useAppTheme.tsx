import {
  darkTheme,
  duneTheme,
  lightTheme,
  neonTheme,
  nocturneTheme,
} from "@/constants/theme";
import { useSettingsContext } from "@/context/SettingsContext";
import { Theme, ThemeType } from "@/types/Theme";
import { useMemo } from "react";

const themes: Record<ThemeType, Theme> = {
  Light: lightTheme,
  Dark: darkTheme,
  Nocturne: nocturneTheme,
  Dune: duneTheme,
  Neon: neonTheme,
};

export const useAppTheme = () => {
  const { settings, updateSetting } = useSettingsContext();

  const themeType = settings?.theme ?? "Light";
  const fontSize = settings?.fontSize ?? "medium";
  const theme = useMemo(() => themes[themeType], [themeType]);

  const setTheme = (nextTheme: ThemeType) => {
    updateSetting("theme", nextTheme);
  };

  const scale = useMemo(() => {
    switch (fontSize) {
      case "small":
        return 0.9;
      case "medium":
        return 1;
      case "large":
        return 1.1;
      default:
        return 1;
    }
  }, [fontSize]);

  return { theme, themeType, setTheme, scale };
};
