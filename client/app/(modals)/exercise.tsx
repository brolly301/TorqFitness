import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import AppSearchBar from "@/components/ui/AppSearchBar";
import ExerciseList from "@/components/exercises/ExerciseList";
import exercises from "@/constants/exercises.json";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

export default function ExerciseModal() {
  const [search, setSearch] = useState<string>("");
  const { target } = useLocalSearchParams<{ target: "workout" | "routine" }>();

  return (
    <View>
      <AppSearchBar setSearch={setSearch} />
      <ExerciseList exercises={exercises} target={target} />
    </View>
  );
}

const styles = StyleSheet.create({});
