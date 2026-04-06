import { StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Button } from "@react-navigation/elements";
import { useExerciseContext } from "@/context/ExerciseContext";
import * as crypto from "expo-crypto";
import AppDropdown from "@/components/ui/AppDropdown";
import {
  bodyParts,
  equipment,
  primaryMuscles,
} from "@/constants/exerciseDropdowns";
import { Exercise } from "@/types/Global";

export default function CreateExerciseScreen() {
  const [exercise, setExercise] = useState<Exercise>({
    id: crypto.randomUUID(),
    name: "",
    primaryMuscles: [],
    bodyParts: [],
    equipment: [],
    userCreated: true,
  });

  const isDisabled =
    !exercise.name.trim() ||
    exercise.primaryMuscles.length === 0 ||
    exercise.bodyParts.length === 0 ||
    exercise.equipment.length === 0;

  const { setExercises } = useExerciseContext();

  const handleSubmit = () => {
    setExercises((prev) => [...prev, exercise]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        placeholderTextColor="black"
        style={styles.input}
        textAlignVertical="center"
        value={exercise.name}
        onChangeText={(text) =>
          setExercise((prev) => ({ ...prev, name: text }))
        }
      />
      <AppDropdown
        selected={exercise.primaryMuscles[0] || ""}
        data={primaryMuscles}
        setSelected={(selected) =>
          setExercise((prev) => ({
            ...prev,
            primaryMuscles: selected ? [selected] : [],
          }))
        }
        placeholder="Select a muscle"
      />
      <AppDropdown
        selected={exercise.bodyParts[0] || ""}
        data={bodyParts}
        setSelected={(selected) =>
          setExercise((prev) => ({
            ...prev,
            bodyParts: selected ? [selected] : [],
          }))
        }
        placeholder="Select a body part"
      />
      <AppDropdown
        selected={exercise.equipment[0] || ""}
        data={equipment}
        setSelected={(selected) =>
          setExercise((prev) => ({
            ...prev,
            equipment: selected ? [selected] : [],
          }))
        }
        placeholder="Select equipment"
      />
      <Button
        disabled={isDisabled}
        onPressIn={handleSubmit}
        style={{ backgroundColor: isDisabled ? "red" : "green" }}
      >
        Save Exercise
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
  },
});
