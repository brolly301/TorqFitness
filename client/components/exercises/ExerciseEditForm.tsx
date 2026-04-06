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
import DeleteModal from "../modals/confirmation/DeleteModal";

type Props = { exercise: Exercise | null } & Pick<
  ModalProps,
  "setModalVisible"
>;

export default function ExerciseEditForm({ exercise, setModalVisible }: Props) {
  if (!exercise) return null;

  const [exerciseData, setExerciseData] = useState<Exercise>(exercise);

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const isDisabled =
    !exercise.name.trim() ||
    exercise.primaryMuscles.length === 0 ||
    exercise.bodyParts.length === 0 ||
    exercise.equipment.length === 0;

  const { updateExercise, archiveExercise } = useExerciseContext();

  const handleSubmit = () => {
    updateExercise(exerciseData);
    setModalVisible(false);
  };

  const onConfirm = () => {
    archiveExercise(exerciseData.id);
    setModalVisible(false);
  };

  return (
    <>
      <DeleteModal
        modalVisible={deleteModalVisible}
        setModalVisible={setDeleteModalVisible}
        placeholder="workout"
        onConfirm={onConfirm}
      />
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
          disabled={isDisabled}
          onPress={handleSubmit}
          style={{
            backgroundColor: isDisabled ? "red" : "green",
          }}
        >
          Save Exercise
        </Button>
        <Button
          onPress={() => {
            setDeleteModalVisible(true);
          }}
        >
          Archive Exercise
        </Button>
      </View>
    </>
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
