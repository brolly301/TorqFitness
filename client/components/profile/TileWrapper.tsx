import { StyleSheet, Text, View } from "react-native";
import React, { ReactNode, useMemo } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type Props = {
  children: ReactNode;
  title: string;
};

export default function TileWrapper({ children, title }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      padding: 10 * scale,
      backgroundColor: theme.background,
      borderRadius: 10,
      marginVertical: 5 * scale,
    },
    title: {
      fontSize: 20 * scale,
      fontWeight: "600",
      marginBottom: 20 * scale,
    },
  });
