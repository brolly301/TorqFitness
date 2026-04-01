import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Routine } from "@/types/Global";
import exercises from "../../../constants/exercises.json";

type Props = {
  routine: Routine;
};

export default function RoutineDetails({ routine }: Props) {
  const exerciseList = routine.exercises.map((rtEx) => {
    const details = exercises.find(
      (exercise) => exercise.id === rtEx.exerciseId,
    );
    return { ...rtEx, details };
  });

  return (
    <View>
      <Text>{routine.name}</Text>
      {exerciseList.map((exercise) => {
        return <View>{exercise.details?.name}</View>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({});
