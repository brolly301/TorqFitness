import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Exercise } from "@/types/Global";

type Props = {
  exercise: Exercise;
};

export default function ExerciseItem({ exercise }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{exercise.name}</Text>
      <Text style={styles.primaryMuscle}>
        {exercise.primaryMuscle} & {exercise.secondaryMuscle}
      </Text>
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
  name: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
  },
  primaryMuscle: {
    fontSize: 14,
  },
});
