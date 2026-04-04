import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import AppSearchBar from "@/components/ui/AppSearchBar";
import ExerciseList from "@/components/exercises/ExerciseList";
import { useExerciseContext } from "@/context/ExerciseContext";

export default function ExerciseScreen() {
  const [search, setSearch] = useState<string>("");
  const { exercises } = useExerciseContext();

  const normalize = (text: string) => text.toLowerCase().replace(/[\s-]/g, "");

  const filteredExercises = exercises
    .slice(0, 30)
    .filter((exercise) => normalize(exercise.name).includes(normalize(search)));

  return (
    <View>
      <AppSearchBar setSearch={setSearch} />
      <ExerciseList showAddButton={false} exercises={filteredExercises} />
    </View>
  );
}

const styles = StyleSheet.create({});
