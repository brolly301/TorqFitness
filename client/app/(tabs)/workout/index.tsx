import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "@react-navigation/elements";
import WorkoutTile from "@/components/workout/WorkoutTile";
import RoutineTile from "@/components/workout/RoutineTile";

export default function WorkoutScreen() {
  return (
    <View>
      <Button>Start Workout</Button>
      <Text style={styles.subTitle}>Previous Workouts</Text>
      <WorkoutTile />
      <WorkoutTile />
      <WorkoutTile />
      <Text style={styles.subTitle}>My Routines</Text>
      <RoutineTile />
      <RoutineTile />
      <RoutineTile />
    </View>
  );
}

const styles = StyleSheet.create({
  subTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
});
