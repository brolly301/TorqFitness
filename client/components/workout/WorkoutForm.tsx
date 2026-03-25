import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button } from "@react-navigation/elements";
import { router } from "expo-router";
import Timer from "./Timer";
import { Workout } from "@/types/Global";
import { useExerciseContext } from "@/context/ExerciseContext";
import * as crypto from "expo-crypto";

type Props = {
  workout: Workout;
  setWorkout: React.Dispatch<React.SetStateAction<Workout>>;
};

export default function WorkoutForm({ workout, setWorkout }: Props) {
  const { exercises } = useExerciseContext();

  useEffect(() => {
    const startedAt = new Date().toISOString();

    setWorkout((prev) => ({
      ...prev,
      startedAt,
    }));
  }, []);

  const exerciseList = workout.exercises.map((we) => {
    const details = exercises.find((ex) => ex.id === we.exerciseId);

    return { ...we, details };
  });

  const addSet = (exerciseId: string) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
        return exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [
                ...exercise.sets,
                {
                  id: crypto.randomUUID(),
                  order: exercise.sets.length + 1,
                  reps: 0,
                  weight: null,
                },
              ],
            }
          : exercise;
      }),
    }));
  };

  const updateForm = (
    field: "name" | "description" | "notes",
    value: string,
  ) => {
    setWorkout((prev) => {
      return { ...prev, [field]: value };
    });
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: "reps" | "weight",
    value: number | null,
  ) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
        return exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) => {
                return set.id === setId ? { ...set, [field]: value } : set;
              }),
            }
          : exercise;
      }),
    }));
  };

  return (
    <>
      <View>
        <Timer />
        <TextInput
          placeholder="Workout #1"
          placeholderTextColor={"black"}
          onChangeText={(text) => updateForm("name", text)}
          style={styles.nameInput}
        />
        <TextInput
          placeholder="Enter description"
          placeholderTextColor={"black"}
          onChangeText={(text) => updateForm("description", text)}
          style={styles.nameInput}
        />
        <TextInput
          placeholder="Enter workout notes"
          placeholderTextColor={"black"}
          onChangeText={(text) => updateForm("notes", text)}
          style={styles.nameInput}
        />
        {exerciseList
          ? exerciseList.map((exercise) => {
              return (
                <View key={exercise.id} style={styles.workoutContainer}>
                  <Text>{exercise.details?.name}</Text>
                  <View style={styles.headerContainer}>
                    <View style={styles.exerciseInputContainer}>
                      <Text>Set</Text>
                    </View>
                    <View style={styles.exerciseInputContainer}>
                      <Text>Reps</Text>
                    </View>
                    <View style={styles.exerciseInputContainer}>
                      <Text>Weight</Text>
                    </View>
                  </View>
                  {exercise.sets.map((set) => {
                    return (
                      <View key={set.id} style={styles.exerciseContainer}>
                        <View style={styles.exerciseInputContainer}>
                          <TextInput
                            placeholder={set.order.toString()}
                            placeholderTextColor={"black"}
                            style={styles.nameInput}
                          />
                        </View>
                        <View style={styles.exerciseInputContainer}>
                          <TextInput
                            placeholder={set.reps.toString()}
                            placeholderTextColor={"black"}
                            onChangeText={(text) =>
                              updateSet(
                                exercise.id,
                                set.id,
                                "reps",
                                parseInt(text),
                              )
                            }
                            style={styles.nameInput}
                          />
                        </View>
                        <View style={styles.exerciseInputContainer}>
                          <TextInput
                            placeholder={set.weight?.toString()}
                            placeholderTextColor={"black"}
                            onChangeText={(text) =>
                              updateSet(
                                exercise.id,
                                set.id,
                                "weight",
                                parseInt(text),
                              )
                            }
                            style={styles.nameInput}
                          />
                        </View>
                      </View>
                    );
                  })}

                  <Button onPressIn={() => addSet(exercise.id)}>Add set</Button>
                </View>
              );
            })
          : null}

        <Button onPress={() => router.push("../../(modals)/exercise")}>
          Add Exercise
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  nameInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  workoutContainer: {
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  exerciseInputContainer: {
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  exerciseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    gap: 8,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    gap: 8,
  },
});
