import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

export default function Timer() {
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
      <Text>{hour.toString().padStart(2, "0")}:</Text>
      <Text>{minute.toString().padStart(2, "0")}:</Text>
      <Text>{second.toString().padStart(2, "0")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timeContainer: {
    flexDirection: "row",
  },
});
