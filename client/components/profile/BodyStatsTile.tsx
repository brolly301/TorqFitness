import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TileWrapper from "./TileWrapper";

export default function BodyStatsTile() {
  return (
    <TileWrapper title="Body Statistics">
      <View style={styles.container}>
        <View>
          <Text style={styles.label}>Height</Text>
          <Text style={styles.value}>5ft 11</Text>
          <Text style={styles.label}>Weight</Text>
          <Text style={styles.value}>76.2kg</Text>
        </View>
        <View>
          <Text style={styles.label}>Age</Text>
          <Text style={styles.value}>27</Text>
          <Text style={styles.label}>Activity Level</Text>
          <Text style={styles.value}>Very Active</Text>
        </View>
        <View>
          <View style={styles.statsContainer}>
            <Text style={styles.label}>Current Goal</Text>
            <Text style={styles.value}>Maintain Weight</Text>
          </View>
          <Text style={styles.label}>Goal Weight</Text>
          <Text style={styles.value}>76.2kg</Text>
        </View>
      </View>
    </TileWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsContainer: {},
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 15,
  },
});
