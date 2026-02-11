import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import AppSeaechBar from "@/components/ui/AppSeaechBar";
import ExerciseList from "@/components/exercises/ExerciseList";
import { exercises } from "@/constants/seeds";

export default function ExerciseScreen() {
  const [search, setSearch] = useState<string>("");

  const normalize = (text: string) => text.toLowerCase().replace(/[\s-]/g, "");

  const filteredExercises = exercises.filter((exercise) =>
    normalize(exercise.name).includes(normalize(search)),
  );

  return (
    <View>
      <AppSeaechBar setSearch={setSearch} />
      <ExerciseList exercises={filteredExercises} />
    </View>
  );
}

const styles = StyleSheet.create({});
