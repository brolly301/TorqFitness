import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import AppError from "@/components/ui/AppError";
import { Button } from "@react-navigation/elements";
import {
  exerciseSchema,
  ExerciseSchema,
} from "@/utils/validation/exerciseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useExerciseContext } from "@/context/ExerciseContext";
import * as crypto from "expo-crypto";
import AppDropdown from "@/components/ui/AppDropdown";
import {
  bodyParts,
  equipment,
  primaryMuscles,
} from "@/constants/exerciseDropdowns";

export default function CreateExerciseScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseSchema>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: "",
      primaryMuscles: [],
      bodyParts: [],
      equipment: [],
    },
    mode: "onChange",
  });

  const { exercises, setExercises } = useExerciseContext();

  const onSubmit = (data: ExerciseSchema) => {
    const exercise = {
      id: crypto.randomUUID(),
      gifUrl: "https://static.exercisedb.dev/media/MCkqdKE.gif",
      ...data,
    };

    setExercises((prev) => [...prev, exercise]);
  };

  console.log(exercises);

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
      <Button onPressIn={handleSubmit(onSubmit)}>Save Exercise</Button>
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

{
}
