import { StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import { useExerciseContext } from "@/context/ExerciseContext";
import AppDropdown from "../ui/AppDropdown";
import { Button } from "@react-navigation/elements";
import {
  bodyParts,
  equipment,
  primaryMuscles,
} from "@/constants/exerciseDropdowns";
import { Exercise, ModalProps } from "@/types/Global";

type Props = { exercise: Exercise | null } & Pick<
  ModalProps,
  "setModalVisible"
>;

export default function ExerciseEditForm({ exercise, setModalVisible }: Props) {
  if (!exercise) return null;

  const [exerciseData, setExerciseData] = useState<Exercise>(exercise);
  const { updateExercise, archiveExercise } = useExerciseContext();

  const handleSubmit = () => {
    updateExercise(exerciseData);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        placeholderTextColor="black"
        style={styles.input}
        textAlignVertical="center"
        value={exerciseData.name}
        onChangeText={(text) =>
          setExerciseData((prev) => ({ ...prev, name: text }))
        }
      />

      <AppDropdown
        selected={exerciseData.primaryMuscles[0] || ""}
        data={primaryMuscles}
        setSelected={(selected) =>
          setExerciseData((prev) => ({
            ...prev,
            primaryMuscles: selected ? [selected] : [],
          }))
        }
        placeholder="Select a muscle"
      />

      <AppDropdown
        selected={exerciseData.bodyParts[0] || ""}
        data={bodyParts}
        setSelected={(selected) =>
          setExerciseData((prev) => ({
            ...prev,
            bodyParts: selected ? [selected] : [],
          }))
        }
        placeholder="Select a body part"
      />

      <AppDropdown
        selected={exerciseData.equipment[0] || ""}
        data={equipment}
        setSelected={(selected) =>
          setExerciseData((prev) => ({
            ...prev,
            equipment: selected ? [selected] : [],
          }))
        }
        placeholder="Select equipment"
      />

      <Button
        disabled={!exerciseData.name.trim()}
        onPress={handleSubmit}
        style={{
          backgroundColor: !exerciseData.name.trim() ? "red" : "green",
        }}
      >
        Save Exercise
      </Button>

      <Button
        onPress={() => {
          archiveExercise(exerciseData.id);
          setModalVisible(false);
        }}
      >
        Archive Exercise
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
