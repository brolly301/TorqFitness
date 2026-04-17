import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

export default function StartButton() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <View style={styles.container}>
      <FontAwesome6 name="plus" size={20} color={theme.buttonPrimaryText} />
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      width: 50,
      height: 50,
      backgroundColor: theme.buttonPrimary,
      borderRadius: 100,
      position: "absolute",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
  });
