import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ExerciseFormValues,
  exerciseSchema,
} from "@/utils/validation/exerciseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useExerciseContext } from "@/context/ExerciseContext";
import AppError from "../ui/AppError";
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: "",
      primaryMuscles: [],
      bodyParts: [],
      equipment: [],
    },
    mode: "onChange",
  });

  const { updateExercise, archiveExercise } = useExerciseContext();

  const onSubmit = (data: ExerciseFormValues) => {
    if (!exercise) return;

    updateExercise({ id: exercise.id, ...data });
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Controller
        key={"name"}
        control={control}
        name={"name"}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              placeholder="Name"
              placeholderTextColor="black"
              style={styles.input}
              textAlignVertical="center"
              value={value}
              onChangeText={onChange}
            />
            {errors.name && <AppError>{errors.name.message}</AppError>}
          </>
        )}
      />
      <Controller
        key={"primaryMuscles"}
        control={control}
        name={"primaryMuscles"}
        render={({ field: { onChange, value } }) => (
          <>
            <AppDropdown
              selected={value[0] || ""}
              data={primaryMuscles}
              setSelected={(selected) => onChange(selected ? [selected] : [])}
              placeholder="Select a muscle"
            />
            {errors.primaryMuscles && (
              <AppError>{errors.primaryMuscles.message}</AppError>
            )}
          </>
        )}
      />
      <Controller
        key={"bodyParts"}
        control={control}
        name={"bodyParts"}
        render={({ field: { onChange, value } }) => (
          <>
            <AppDropdown
              selected={value[0] || ""}
              data={bodyParts}
              setSelected={(selected) => onChange(selected ? [selected] : [])}
              placeholder="Select a body part"
            />
            {errors.bodyParts && (
              <AppError>{errors.bodyParts.message}</AppError>
            )}
          </>
        )}
      />
      <Controller
        key={"equipment"}
        control={control}
        name={"equipment"}
        render={({ field: { onChange, value } }) => (
          <>
            <AppDropdown
              selected={value[0] || ""}
              data={equipment}
              setSelected={(selected) => onChange(selected ? [selected] : [])}
              placeholder="Select equipment"
            />
            {errors.equipment && (
              <AppError>{errors.equipment.message}</AppError>
            )}
          </>
        )}
      />
      <Button onPressIn={handleSubmit(onSubmit)}>Save Changes</Button>
      <Button
        onPressIn={() => {
          if (!exercise) return;
          archiveExercise(exercise.id);
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
