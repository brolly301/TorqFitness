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
      padding: 10 * scale,
      backgroundColor: theme.card,
      borderRadius: 10,
      marginVertical: 5 * scale,
      marginBottom: 25,
    },
    title: {
      fontSize: 20 * scale,
      fontWeight: "500",
      color: theme.text,
      marginBottom: 5 * scale,
    },
  });
