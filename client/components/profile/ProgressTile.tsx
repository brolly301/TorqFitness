import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TileWrapper from "./TileWrapper";

export default function ProgressTile() {
  return (
    <TileWrapper title="Progress">
      <View style={styles.tilesContainer}>
        <View style={styles.progressContainer}>
          <Text>Total Volume</Text>
          <Text>170k/500k</Text>
        </View>
        <View
          style={[
            styles.progressContainer,
            { borderColor: "rgb(73, 164, 214)" },
          ]}
        >
          <Text>Bench Press</Text>
          <Text>90kg/120kg</Text>
        </View>
        <View
          style={[
            styles.progressContainer,
            { borderColor: "rgb(214, 82, 73)" },
          ]}
        >
          <Text>Monthly Steps</Text>
          <Text>420k/600k</Text>
        </View>
      </View>
    </TileWrapper>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    borderWidth: 10,
    borderColor: "rgb(59, 184, 90)",
    borderRadius: 100,
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  tilesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
