import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";

import Timer from "./Timer";
import { useExerciseContext } from "@/context/ExerciseContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ModalProps, WorkoutDraft } from "@/types/Global";
import { Theme } from "@/types/Theme";
import { capitalizeWords } from "@/utils/helpers";
import { addSet, removeExercise, updateSet } from "@/utils/workoutUtil";

type Props<T extends WorkoutDraft> = {
  draft: T;
  setDraft: React.Dispatch<React.SetStateAction<T>>;
  mode: "workout" | "routine";
} & Pick<ModalProps, "setModalVisible">;

export default function WorkoutForm<T extends WorkoutDraft>({
  draft,
  setDraft,
  mode,
  setModalVisible,
}: Props<T>) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const { exercises } = useExerciseContext();

  const exerciseList = draft.exercises.map((workoutExercise) => {
    const details = exercises.find(
      (exercise) => exercise.id === workoutExercise.exerciseId,
    );

    return {
      ...workoutExercise,
      details,
    };
  });

  const updateForm = (field: "name" | "notes", value: string) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const totalVolume = exerciseList.reduce((workoutTotal, exercise) => {
    const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
      return setTotal + Number(set.reps || 0) * Number(set.weight || 0);
    }, 0);

    return workoutTotal + exerciseVolume;
  }, 0);

  const totalSets = exerciseList.reduce((total, exercise) => {
    return total + exercise.sets.length;
  }, 0);

  return (
    <View>
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <TextInput
            placeholderTextColor={theme.textSecondary}
            value={draft.name}
            onChangeText={(text) => updateForm("name", text)}
            style={styles.nameInput}
          />

          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>Volume {totalVolume} kg</Text>
            <Text style={styles.metaText}> • </Text>
            <Text style={styles.metaText}>{totalSets} sets</Text>
          </View>
        </View>
        {mode === "workout" ? <Timer /> : null}
      </View>

      <View style={styles.hr} />

      <TextInput
        placeholder={`Enter ${mode === "workout" ? "workout" : "routine"} notes`}
        placeholderTextColor={theme.textSecondary}
        value={draft.notes ?? ""}
        onChangeText={(text) => updateForm("notes", text)}
        style={styles.notesInput}
      />

      {exerciseList.map((exercise) => {
        const primaryMuscle = capitalizeWords(
          exercise.details?.primaryMuscles?.[0] ?? "",
        );
        const secondaryMuscle = capitalizeWords(
          exercise.details?.secondaryMuscles?.[0] ?? "",
        );
        const muscleLabel = secondaryMuscle
          ? `${primaryMuscle} & ${secondaryMuscle}`
          : primaryMuscle;

        return (
          <View key={exercise.id} style={styles.workoutContainer}>
            <View style={styles.nameButtonContainer}>
              <View style={styles.exerciseHeading}>
                <Text style={styles.exerciseName}>
                  {capitalizeWords(exercise.details?.name ?? "")}
                </Text>

                {!!muscleLabel && (
                  <Text style={styles.muscleName}>{muscleLabel}</Text>
                )}
              </View>

              <Pressable
                onPress={() => removeExercise(setDraft, exercise.id)}
                hitSlop={8}
              >
                <EvilIcons
                  name="trash"
                  size={30 * scale}
                  color={theme.error ?? "red"}
                />
              </Pressable>
            </View>

            {exercise.sets.map((set, index) => {
              const previousText = "40 × 8";

              return (
                <View key={set.id} style={styles.exerciseContainer}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={styles.setHeader}>
                      <Text style={styles.setLabel}>Set {index + 1}</Text>
                      <Text style={styles.setDivider}>|</Text>
                      <Text style={styles.previousText}>{previousText}</Text>
                      <Text style={styles.previousLabel}> (last)</Text>
                    </View>
                    <Text style={styles.previousLabel}>{totalVolume} kg</Text>
                  </View>

                  <View style={styles.inputsRow}>
                    <View style={styles.valueLabelContainer}>
                      <TextInput
                        value={set.weight ? String(set.weight) : ""}
                        placeholder="0"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="numeric"
                        onChangeText={(text) =>
                          updateSet(
                            setDraft,
                            exercise.id,
                            set.id,
                            "weight",
                            text === "" ? 0 : parseInt(text, 10) || 0,
                          )
                        }
                        style={styles.valueInput}
                      />
                      <Text style={styles.labelText}>kg</Text>
                    </View>

                    <Text style={styles.x}>×</Text>

                    <View style={styles.valueLabelContainer}>
                      <TextInput
                        value={set.reps ? String(set.reps) : ""}
                        placeholder="0"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="numeric"
                        onChangeText={(text) =>
                          updateSet(
                            setDraft,
                            exercise.id,
                            set.id,
                            "reps",
                            text === "" ? 0 : parseInt(text, 10) || 0,
                          )
                        }
                        style={styles.valueInput}
                      />
                      <Text style={styles.labelText}>reps</Text>
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
      })}

      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Add Exercise</Text>
      </Pressable>
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    headerTextContainer: {
      flex: 1,
      marginRight: 12 * scale,
    },
    nameInput: {
      fontSize: 30 * scale,
      color: theme.text,
      fontWeight: "bold",
      marginBottom: 8 * scale,
      padding: 0,
    },
    notesInput: {
      fontSize: 14 * scale,
      color: theme.text,
      backgroundColor: theme.buttonSecondary,
      paddingHorizontal: 12 * scale,
      paddingVertical: 12 * scale,
      borderRadius: 12 * scale,
      marginBottom: 20 * scale,
    },
    metaContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    metaText: {
      fontSize: 14 * scale,
      fontWeight: "400",
      color: theme.textSecondary,
    },
    hr: {
      height: 1 * scale,
      backgroundColor: theme.divider,
      marginVertical: 15 * scale,
    },
    workoutContainer: {
      borderRadius: 10 * scale,
      padding: 16 * scale,
      marginBottom: 10 * scale,
      backgroundColor: theme.card,
    },
    nameButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20 * scale,
    },
    exerciseHeading: {
      flex: 1,
      marginRight: 12 * scale,
    },
    exerciseName: {
      fontSize: 20 * scale,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 2 * scale,
    },
    muscleName: {
      fontSize: 16 * scale,
      fontWeight: "500",
      color: theme.text,
    },
    exerciseContainer: {
      backgroundColor: theme.buttonSecondary,
      borderRadius: 10 * scale,
      marginBottom: 10 * scale,
      padding: 12 * scale,
    },
    setHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10 * scale,
    },
    setLabel: {
      fontSize: 16 * scale,
      fontWeight: "600",
      color: theme.text,
    },
    setDivider: {
      fontSize: 16 * scale,
      color: theme.textSecondary,
      marginHorizontal: 6 * scale,
    },
    previousText: {
      fontSize: 16 * scale,
      fontWeight: "600",
      color: theme.text,
    },
    previousLabel: {
      fontSize: 16 * scale,
      color: theme.textSecondary,
    },
    inputsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    valueLabelContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 10 * scale,
      paddingVertical: 8 * scale,
      paddingHorizontal: 10 * scale,
    },
    valueInput: {
      fontSize: 16 * scale,
      fontWeight: "600",
      color: theme.text,
      textAlign: "center",
      minWidth: 32 * scale,
      padding: 0,
    },
    labelText: {
      fontSize: 15 * scale,
      fontWeight: "400",
      color: theme.text,
      marginLeft: 4 * scale,
    },
    x: {
      fontSize: 18 * scale,
      fontWeight: "600",
      color: theme.textSecondary,
      marginHorizontal: 10 * scale,
    },
    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12 * scale,
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
      borderRadius: 12 * scale,
      paddingVertical: 10 * scale,
      backgroundColor: theme.buttonSecondary,
    },
    secondaryButtonText: {
      fontSize: 12 * scale,
      fontWeight: "bold",
      color: theme.buttonSecondaryText,
    },
  });
