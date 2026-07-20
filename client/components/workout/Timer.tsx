import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import Feather from "@expo/vector-icons/Feather";

export default function Timer() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const second = time % 60;
  const minute = Math.floor((time / 60) % 60);
  const hour = Math.floor(time / 3600);

  return (
    <View style={styles.timeContainer}>
      <Feather name="clock" size={13 * scale} color={theme.buttonPrimary} />

      <Text style={styles.time}>
        {hour.toString().padStart(2, "0")}:{minute.toString().padStart(2, "0")}:
        {second.toString().padStart(2, "0")}
      </Text>
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6 * scale,
      paddingHorizontal: 9 * scale,
      paddingVertical: 6 * scale,
      backgroundColor: theme.buttonPrimary + "12",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "30",
      borderRadius: 10 * scale,
    },

    time: {
      color: theme.buttonPrimary,
      fontSize: 13 * scale,
      fontWeight: "700",
      fontVariant: ["tabular-nums"],
    },
  });
