import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TileWrapper from "./TileWrapper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function AchievementTile() {
  return (
    <TileWrapper title="Achievements">
      <View style={styles.container}>
        <View style={styles.tileContainer}>
          <MaterialCommunityIcons
            name="weight-lifter"
            size={24}
            color="black"
          />
          <View style={styles.tile}>
            <Text>Max Bench</Text>
            <Text>110kg</Text>
          </View>
        </View>
        <View style={styles.tileContainer}>
          <FontAwesome5 name="calendar-check" size={24} color="black" />
          <View style={styles.tile}>
            <Text>Longest Streak</Text>
            <Text>9 days</Text>
          </View>
        </View>
        <View style={styles.tileContainer}>
          <MaterialCommunityIcons name="weight" size={24} color="black" />
          <View style={styles.tile}>
            <Text>Heaviest Lift</Text>
            <Text>180kg Deadlift</Text>
          </View>
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
  tileContainer: {
    flexDirection: "row",
  },
  tile: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
