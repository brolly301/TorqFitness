import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import AppError from "@/components/ui/AppError";
import { Button } from "@react-navigation/elements";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkoutSchema, workoutSchema } from "@/utils/validation/workoutSchema";
import { router } from "expo-router";

export default function CreateRoutineScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkoutSchema>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: WorkoutSchema) => {
    console.log("Submitted data:", data);
  };

  const fields: { key: keyof WorkoutSchema; placeholder: string }[] = [
    { key: "name", placeholder: "Name" },
    { key: "description", placeholder: "Description" },
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
      <Button onPress={() => router.push("../../(modals)/exercise")}>
        Add Exercise
      </Button>

      <Button onPressIn={handleSubmit(onSubmit)}>Save Routine</Button>
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
