import { StyleSheet, Text, View } from "react-native";
import React, { ReactNode, useMemo } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type Props = {
  children: ReactNode;
  title?: string;
};

export default function TileWrapper({ children, title }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  return (
    <>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.container}>{children}</View>
    </>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      marginBottom: 22 * scale,
      overflow: "hidden",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16 * scale,
    },

    title: {
      marginBottom: 10 * scale,
      paddingHorizontal: 2 * scale,
      color: theme.text,
      fontSize: 19 * scale,
      fontWeight: "700",
    },
  });