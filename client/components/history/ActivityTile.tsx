import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Workout } from "@/types/Global";
import exercises from "../../constants/exercises.json";

type Props = {
  workout: Workout;
};

export default function ActivityTile({ workout }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{workout.name}</Text>
      <Text style={styles.description}>{workout.description}</Text>
      <Text style={styles.date}>{workout.startTime}</Text>
      {workout.exercises.map((exercise) => {
        return (
          <View style={styles.exerciseContainer}>
            <Text style={styles.exerciseName}>{exercise.exerciseId}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  name: {
    color: "black",
    fontSize: 20,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
  },
  date: {
    fontSize: 14,
  },
  exerciseContainer: {},
  exerciseName: {},
});
