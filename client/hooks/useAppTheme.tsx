import { useThemeContext } from "@/context/ThemeProvider";

export const useAppTheme = () => {
  const { theme } = useThemeContext();
  const scale = 1;

  const fonts = {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
  } as const;

  return { theme, scale, fonts };
};
