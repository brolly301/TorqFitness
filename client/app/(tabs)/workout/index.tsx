import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "@react-navigation/elements";
import WorkoutTile from "@/components/workout/WorkoutTile";
import RoutineTile from "@/components/workout/RoutineTile";
import { router } from "expo-router";
import { useWorkoutContext } from "@/context/WorkoutContext";

export default function WorkoutScreen() {
  const { workouts } = useWorkoutContext();

  return (
    <View>
      <Button
        onPressIn={() => router.navigate("/(tabs)/workout/createWorkout")}
      >
        Start Workout
      </Button>
      <Text style={styles.subTitle}>Previous Workouts</Text>
      {workouts.map((workout) => {
        return <WorkoutTile key={workout.id} workout={workout} />;
      })}
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
