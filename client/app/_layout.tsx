import { Stack } from "expo-router";
import "react-native-reanimated";
import React, { useMemo } from "react";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  ThemeProvider,
} from "@react-navigation/native";
import Providers from "./providers";
import { useUserContext } from "@/context/UserContext";
import { useAppTheme } from "@/hooks/useAppTheme";

function RootStack() {
  const { authToken } = useUserContext();
  const { theme, themeType } = useAppTheme();

  const navigationTheme = useMemo(() => {
    const isDark =
      themeType === "Dark" ||
      themeType === "Nocturne" ||
      themeType === "Neon";

    const baseTheme = isDark
      ? NavigationDarkTheme
      : NavigationLightTheme;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: theme.buttonPrimary,
        background: theme.background,
        card: theme.card,
        text: theme.text,
        border: theme.border,
        notification: theme.error,
      },
    };
  }, [theme, themeType]);

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        <Stack.Protected guard={!authToken.valid}>
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="+not-found" />
        </Stack.Protected>

        <Stack.Protected guard={authToken.valid}>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="+not-found" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}

export default function AppLayout() {
  return (
    <Providers>
      <RootStack />
    </Providers>
  );
}
