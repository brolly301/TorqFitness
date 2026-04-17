import { StyleSheet, Switch, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ThemeType, useThemeContext } from "@/context/ThemeProvider";
import AppDropdown from "@/components/ui/AppDropdown";

const themeData = ["Light", "Dark", "Nocturne", "Dune", "Neon"];

export default function ThemeToggle() {
  const { theme, scale } = useAppTheme();
  const { themeType, toggleTheme } = useThemeContext();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const [selectedTheme, setSelectedTheme] = useState<ThemeType>("Light");

  return (
    <View>
      <AppDropdown
        data={themeData}
        selected={selectedTheme}
        setSelected={(selected) => {
          setSelectedTheme(selected as ThemeType);
          toggleTheme(selected as ThemeType);
        }}
        placeholder="Theme"
      />
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    title: {
      fontSize: 18 * scale,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 16,
    },
  });
