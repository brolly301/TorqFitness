import { StyleSheet, Text, View } from "react-native";
import React, { ReactNode, useMemo } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

export default function AppError({ children }: { children: ReactNode }) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  return <Text style={styles.error}>{children}</Text>;
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    error: {
      fontSize: 12 * scale,
      color: theme.error,
      fontWeight: "500",
    },
  });
