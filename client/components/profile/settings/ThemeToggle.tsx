import { StyleSheet, Switch, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Theme, ThemeType } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import AppDropdown from "@/components/ui/AppDropdown";
import { useSettingsContext } from "@/context/SettingsContext";

const themeData = ["Light", "Dark", "Nocturne", "Dune", "Neon"];

export default function ThemeToggle() {
  const { theme, scale, setTheme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { settings } = useSettingsContext();

  const [selectedTheme, setSelectedTheme] = useState<ThemeType>(
    settings?.theme ?? "Light",
  );

  return (
    <View>
      <AppDropdown
        data={themeData}
        selected={selectedTheme}
        setSelected={(selected) => {
          setSelectedTheme(selected as ThemeType);
          setTheme(selected as ThemeType);
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
