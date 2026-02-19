import { StyleSheet, Text, View } from "react-native";
import React, { ReactNode } from "react";

export default function AppError({ children }: { children: ReactNode }) {
  return <Text style={styles.error}>{children}</Text>;
}

const styles = StyleSheet.create({
  error: {
    fontSize: 12,
    color: "red",
    fontWeight: "500",
  },
});
