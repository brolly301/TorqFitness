import { StyleSheet, Text, View } from "react-native";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title: string;
};

export default function TileWrapper({ children, title }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
});
