import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import AppSearchBar from "@/components/ui/AppSearchBar";
import ExerciseList from "@/components/exercises/ExerciseList";
import exercises from "@/constants/exercises.json";

export default function ExerciseModal() {
  const [search, setSearch] = useState<string>("");

  return (
    <View>
      <AppSearchBar setSearch={setSearch} />
      <ExerciseList exercises={exercises} />
    </View>
  );
}

const styles = StyleSheet.create({});
