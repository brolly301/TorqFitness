import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

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
      <Text style={styles.time}>{hour.toString().padStart(2, "0")}:</Text>
      <Text style={styles.time}>{minute.toString().padStart(2, "0")}:</Text>
      <Text style={styles.time}>{second.toString().padStart(2, "0")}</Text>
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    timeContainer: {
      flexDirection: "row",
    },
    time: {
      fontSize: 22 * scale,
    },
  });
