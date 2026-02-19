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

export default function CreateExerciseScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseSchema>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: "",
      description: "",
      primaryMuscles: "",
      secondaryMuscles: "",
      bodyParts: "",
      equipment: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: ExerciseSchema) => {
    console.log("Submitted data:", data);
  };

  const fields: { key: keyof ExerciseSchema; placeholder: string }[] = [
    { key: "name", placeholder: "Name" },
    { key: "description", placeholder: "Description" },
    { key: "primaryMuscles", placeholder: "Primary Muscles" },
    { key: "secondaryMuscles", placeholder: "Secondary Muscles" },
    { key: "bodyParts", placeholder: "Body Parts" },
    { key: "equipment", placeholder: "Equipment" },
  ];

  return (
    <View style={styles.container}>
      {fields.map((field) => (
        <Controller
          key={field.key}
          control={control}
          name={field.key}
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                placeholder={field.placeholder}
                placeholderTextColor="black"
                style={styles.input}
                textAlignVertical="center"
                value={value}
                onChangeText={onChange}
              />
              {errors[field.key] && (
                <AppError>{errors[field.key]?.message}</AppError>
              )}
            </>
          )}
        />
      ))}

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
