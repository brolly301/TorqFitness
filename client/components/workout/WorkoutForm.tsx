import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@react-navigation/elements";
import Timer from "./Timer";
import { ModalProps, WorkoutDraft } from "@/types/Global";
import { useExerciseContext } from "@/context/ExerciseContext";
import { addSet, removeExercise, updateSet } from "@/utils/workoutUtil";
import { capitalizeWords, formatDate } from "@/utils/helpers";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type Props<T extends WorkoutDraft> = {
  draft: T;
  setDraft: React.Dispatch<React.SetStateAction<T>>;
  showTimer?: boolean;
} & Pick<ModalProps, "setModalVisible">;

export default function WorkoutForm<T extends WorkoutDraft>({
  draft,
  setDraft,
  showTimer,
  setModalVisible,
}: Props<T>) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { exercises } = useExerciseContext();

  const exerciseList = draft.exercises.map((we) => {
    const details = exercises.find((ex) => ex.id === we.exerciseId);

    return { ...we, details };
  });

  const updateForm = (field: "name" | "notes", value: string) => {
    setDraft((prev) => {
      return { ...prev, [field]: value };
    });
  };

  const date = new Date();

  const totalVolume = exerciseList.reduce((workoutTotal, exercise) => {
    const exerciseVolume = exercise.sets.reduce(
      (setTotal, set) => Number(set.reps) * Number(set.weight) + setTotal,
      0,
    );
    return workoutTotal + exerciseVolume;
  }, 0);

  const totalSets = exerciseList.reduce(
    (total, exercise) => total + exercise.sets.length,
    0,
  );

  return (
    <>
      <View>
        <View style={styles.nameTimer}>
          <View>
            <TextInput
              placeholder="Workout #1"
              placeholderTextColor={"black"}
              value={draft.name}
              onChangeText={(text) => updateForm("name", text)}
              style={styles.nameInput}
            />
            <View style={styles.metaContainer}>
              <Text style={styles.metaText}>Volume {totalVolume}kg</Text>
              <Text style={styles.metaText}> • </Text>
              <Text style={styles.metaText}>{totalSets} sets</Text>
            </View>
          </View>
          <View>
            <Timer />
          </View>
        </View>
        <View style={styles.hr} />
        <TextInput
          placeholder="Enter workout notes"
          placeholderTextColor={"black"}
          value={draft.notes}
          onChangeText={(text) => updateForm("notes", text)}
          style={styles.notesInput}
        />
        <View style={styles.hr} />
        {exerciseList
          ? exerciseList.map((exercise) => {
              return (
                <View key={exercise.id} style={styles.workoutContainer}>
                  <View style={styles.nameButtonContainer}>
                    <View>
                      <Text style={styles.exerciseName}>
                        {capitalizeWords(exercise.details?.name ?? "")}
                      </Text>
                      <Text style={styles.muscleName}>
                        {capitalizeWords(
                          exercise.details?.primaryMuscles[0] ?? "",
                        )}{" "}
                        &{" "}
                        {exercise.details?.secondaryMuscles[0]
                          ? capitalizeWords(
                              exercise.details?.secondaryMuscles[0] ?? "",
                            )
                          : null}
                      </Text>
                    </View>
                    <EvilIcons
                      onPress={() => removeExercise(setDraft, exercise.id)}
                      name="trash"
                      size={30}
                      color={"red"}
                    />
                  </View>
                  {exercise.sets.map((set, index) => {
                    return (
                      <View key={set.id} style={styles.exerciseContainer}>
                        <View style={styles.exerciseInputContainer}>
                          <View style={styles.valueLabelContainer}>
                            <Text style={styles.valuesText}>
                              Set {index + 1}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.exerciseInputContainer}>
                          <View style={styles.valueLabelContainer}>
                            <TextInput
                              placeholder={set.weight?.toString() || "0"}
                              placeholderTextColor={"black"}
                              onChangeText={(text) =>
                                updateSet(
                                  setDraft,
                                  exercise.id,
                                  set.id,
                                  "weight",
                                  parseInt(text),
                                )
                              }
                              style={styles.valuesText}
                            />
                            <Text style={styles.labelText}> kg</Text>
                          </View>
                        </View>
                        <View style={styles.exerciseInputContainer}>
                          <View style={styles.valueLabelContainer}>
                            <TextInput
                              placeholder={`${set.reps.toString()}`}
                              placeholderTextColor={"black"}
                              onChangeText={(text) =>
                                updateSet(
                                  setDraft,
                                  exercise.id,
                                  set.id,
                                  "reps",
                                  parseInt(text),
                                )
                              }
                              style={styles.valuesText}
                            />
                            <Text style={styles.labelText}> reps</Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}

                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() => addSet(setDraft, exercise.id)}
                  >
                    <Text style={styles.secondaryButtonText}>+ Add Set</Text>
                  </Pressable>
                </View>
              );
            })
          : null}
        <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Add Exercise</Text>
        </Pressable>
      </View>
    </>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    nameInput: {
      fontSize: 30 * scale,
      color: theme.text,
      fontWeight: "bold",
      marginBottom: 8,
    },
    notesInput: {
      fontSize: 14 * scale,
      backgroundColor: theme.buttonSecondary,
      padding: 12,
      borderRadius: 12,
    },
    metaContainer: {
      flexDirection: "row",
    },
    metaText: {
      fontSize: 14 * scale,
      fontWeight: "400",
      color: theme.textSecondary,
    },
    nameTimer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      // marginBottom: 15,
    },
    workoutContainer: {
      marginTop: 20 * scale,
      borderRadius: 10 * scale,
      padding: 16 * scale,
      marginBottom: 10 * scale,
      backgroundColor: theme.card,
    },
    exerciseInputContainer: {
      textAlign: "center",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      flex: 1,
      marginBottom: 20 * scale,
    },
    exerciseContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      textAlign: "center",
    },

    nameButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20 * scale,
    },
    exerciseName: {
      fontSize: 20 * scale,
      fontWeight: "bold",
      marginBlock: 2,
    },
    muscleName: {
      fontSize: 16 * scale,
      fontWeight: "500",
    },
    hr: {
      height: 1 * scale,
      backgroundColor: theme.background,
      marginVertical: 15 * scale,
    },
    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12,
      paddingVertical: 12 * scale,
      backgroundColor: theme.buttonPrimary,
    },
    buttonText: {
      fontSize: 14 * scale,
      fontWeight: "bold",
      color: theme.buttonPrimaryText,
    },
    secondaryButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12,
      paddingVertical: 8 * scale,
      width: "83%",
      alignSelf: "center",
      backgroundColor: theme.buttonSecondary,
    },
    secondaryButtonText: {
      fontSize: 12 * scale,
      fontWeight: "bold",
      color: theme.buttonSecondaryText,
    },
    valuesText: {
      fontSize: 16 * scale,
      fontWeight: "600",
    },
    labelText: {
      fontSize: 15 * scale,
      fontWeight: "400",
    },
    valueLabelContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.buttonSecondary,
      padding: 10,
      borderRadius: 10,
    },
  });
