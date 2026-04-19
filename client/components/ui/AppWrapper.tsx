import { StatusBar, StyleSheet } from "react-native";
import React, { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  children: ReactNode;
};

export default function AppWrapper({ children }: Props) {
  const { theme, themeType } = useAppTheme();

  const barStyle = () => {
    switch (themeType) {
      case "Light":
        return "dark-content";
      case "Dark":
        return "light-content";
      case "Nocturne":
        return "light-content";
      case "Dune":
        return "dark-content";
      case "Neon":
        return "light-content";
      default:
        return "dark-content";
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle={barStyle()} backgroundColor={theme.background} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
