import React, { useMemo, useRef } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import WeightInput from "./WeightInput";
import { useSettingsContext } from "@/context/SettingsContext";
import {
  capitalizeWords,
  toDisplayWeight,
  formatWeight,
} from "@/utils/helpers";
import Timer from "./Timer";
import { useExerciseContext } from "@/context/ExerciseContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ModalProps, WorkoutDraft } from "@/types/Global";
import { Theme } from "@/types/Theme";
import { useWorkoutContext } from "@/context/WorkoutContext";

import {
  addSet,
  removeExercise,
  updateSet,
  removeSet,
} from "@/utils/workoutUtil";
import Feather from "@expo/vector-icons/Feather";

type Props<T extends WorkoutDraft> = {
  draft: T;
  setDraft: React.Dispatch<React.SetStateAction<T>>;
  mode: "workout" | "routine";
  showTimer?: boolean;
  excludeWorkoutId?: string;
} & Pick<ModalProps, "setModalVisible">;

export default function WorkoutForm<T extends WorkoutDraft>({
  draft,
  setDraft,
  mode,
  showTimer = false,
  setModalVisible,
  excludeWorkoutId,
}: Props<T>) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const { exercises } = useExerciseContext();
  const { workouts } = useWorkoutContext();
  const { settings } = useSettingsContext();
  const weightUnit = settings?.weightLabel ?? "kg";

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

  const displayedTotalVolume = toDisplayWeight(totalVolume, weightUnit);

  const totalSets = exerciseList.reduce((total, exercise) => {
    return total + exercise.sets.length;
  }, 0);

  const repRefs = useRef<Record<string, TextInput | null>>({});

  const previousSetsByExercise = useMemo(() => {
    const previousSets = new Map<
      string,
      WorkoutDraft["exercises"][number]["sets"]
    >();

    // Workouts are already ordered newest first.
    workouts.forEach((workout) => {
      if (workout.id === excludeWorkoutId) return;

      workout.exercises.forEach((exercise) => {
        if (!previousSets.has(exercise.exerciseId)) {
          previousSets.set(exercise.exerciseId, exercise.sets);
        }
      });
    });

    return previousSets;
  }, [workouts, excludeWorkoutId]);

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.summaryCard}>
          <View style={styles.headerRow}>
            <TextInput
              placeholder="Workout name"
              placeholderTextColor={theme.textSecondary}
              returnKeyType="done"
              value={draft.name}
              onChangeText={(text) => updateForm("name", text)}
              style={styles.nameInput}
            />

            {showTimer ? <Timer /> : null}
          </View>

          <View style={styles.metaContainer}>
            <View style={styles.metaPill}>
              <Text style={styles.metaValue}>
                {displayedTotalVolume} {weightUnit}
              </Text>
              <Text style={styles.metaLabel}>Volume</Text>
            </View>

            <View style={styles.metaPill}>
              <Text style={styles.metaValue}>{totalSets}</Text>
              <Text style={styles.metaLabel}>
                {totalSets === 1 ? "Set" : "Sets"}
              </Text>
            </View>

            <View style={styles.metaPill}>
              <Text style={styles.metaValue}>{exerciseList.length}</Text>
              <Text style={styles.metaLabel}>
                {exerciseList.length === 1 ? "Exercise" : "Exercises"}
              </Text>
            </View>
          </View>

          <TextInput
            placeholder={`Add ${mode === "workout" ? "workout" : "routine"} notes`}
            placeholderTextColor={theme.textSecondary}
            value={draft.notes ?? ""}
            onChangeText={(text) => updateForm("notes", text)}
            style={styles.notesInput}
            multiline
            textAlignVertical="top"
          />
        </View>
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
                  <Text style={styles.exerciseName} numberOfLines={2}>
                    {capitalizeWords(exercise.details?.name ?? "Exercise")}
                  </Text>

                  {!!muscleLabel && (
                    <View style={styles.musclePill}>
                      <Text style={styles.muscleName} numberOfLines={1}>
                        {muscleLabel}
                      </Text>
                    </View>
                  )}
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.removeExerciseButton,
                    pressed && styles.removeButtonPressed,
                  ]}
                  onPress={() => removeExercise(setDraft, exercise.id)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${exercise.details?.name ?? "exercise"}`}
                >
                  <Feather
                    name="trash-2"
                    size={16 * scale}
                    color={theme.error}
                  />
                </Pressable>
              </View>

              {exercise.sets.map((set, index) => {
                const previousSet = previousSetsByExercise.get(
                  exercise.exerciseId,
                )?.[index];

                const previousText = previousSet
                  ? `${formatWeight(
                      previousSet.weight ?? 0,
                      weightUnit,
                    )} × ${previousSet.reps}`
                  : "—";
                const totalSetVolumeKg = set.weight ? set.reps * set.weight : 0;

                const displayedSetVolume = toDisplayWeight(
                  totalSetVolumeKg,
                  weightUnit,
                );

                return (
                  <View key={set.id} style={styles.exerciseContainer}>
                    <View style={styles.setTopRow}>
  <View style={styles.setHeader}>
    <View style={styles.setNumberBadge}>
      <Text style={styles.setNumber}>{index + 1}</Text>
    </View>

    <View style={styles.previousContainer}>
      <Text style={styles.previousLabel}>Previous</Text>
      <Text style={styles.previousText} numberOfLines={1}>
        {previousText}
      </Text>
    </View>
  </View>

  <View style={styles.setActions}>
    <View style={styles.volumePill}>
      <Text style={styles.volumeText}>
        {displayedSetVolume} {weightUnit}
      </Text>
    </View>

    {exercise.sets.length > 1 ? (
      <Pressable
        style={({ pressed }) => [
          styles.removeSetButton,
          pressed && styles.removeButtonPressed,
        ]}
        onPress={() =>
          removeSet(setDraft, exercise.id, set.id)
        }
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Remove set ${index + 1}`}
      >
        <Feather
          name="x"
          size={15 * scale}
          color={theme.error}
        />
      </Pressable>
    ) : null}
  </View>
</View>

<View style={styles.inputsRow}>
  <WeightInput
    storedWeight={set.weight}
    unit={weightUnit}
    onChange={(storedWeight) =>
      updateSet(
        setDraft,
        exercise.id,
        set.id,
        "weight",
        storedWeight,
      )
    }
  />

  <Text style={styles.x}>×</Text>

  <Pressable
    style={styles.valueLabelContainer}
    onPress={() => repRefs.current[set.id]?.focus()}
  >
    <TextInput
      ref={(ref) => {
        repRefs.current[set.id] = ref;
      }}
      value={set.reps ? String(set.reps) : ""}
      returnKeyType="done"
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
  </Pressable>
</View>
                  </View>
                );
              })}

            <Pressable
  style={({ pressed }) => [
    styles.secondaryButton,
    pressed && styles.actionButtonPressed,
  ]}
  onPress={() => addSet(setDraft, exercise.id)}
>
  <Feather
    name="plus"
    size={15 * scale}
    color={theme.buttonPrimary}
  />

  <Text style={styles.secondaryButtonText}>Add set</Text>
</Pressable>
            </View>
          );
        })}

        <Pressable
  style={({ pressed }) => [
    styles.button,
    pressed && styles.actionButtonPressed,
  ]}
  onPress={() => setModalVisible(true)}
>
  <Feather
    name="plus"
    size={17 * scale}
    color={theme.buttonPrimary}
  />

  <Text style={styles.buttonText}>Add exercise</Text>
</Pressable>
      </ScrollView>
    </>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    contentContainer: {
      paddingBottom: 32 * scale,
    },

    summaryCard: {
      marginBottom: 16 * scale,
      padding: 15 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16 * scale,
    },

    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12 * scale,
      marginBottom: 14 * scale,
    },

    nameInput: {
      flex: 1,
      padding: 0,
      color: theme.text,
      fontSize: 25 * scale,
      fontWeight: "700",
    },

    metaContainer: {
      flexDirection: "row",
      gap: 8 * scale,
      marginBottom: 12 * scale,
    },

    metaPill: {
      flex: 1,
      minHeight: 52 * scale,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 6 * scale,
      paddingVertical: 7 * scale,
      backgroundColor: theme.text + "08",
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10 * scale,
    },

    metaValue: {
      marginBottom: 2 * scale,
      color: theme.text,
      fontSize: 13 * scale,
      fontWeight: "700",
    },

    metaLabel: {
      color: theme.textSecondary,
      fontSize: 10 * scale,
      fontWeight: "500",
    },

    notesInput: {
      minHeight: 44 * scale,
      maxHeight: 90 * scale,
      paddingHorizontal: 11 * scale,
      paddingVertical: 10 * scale,
      backgroundColor: theme.buttonSecondary,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10 * scale,
      color: theme.text,
      fontSize: 13 * scale,
      lineHeight: 18 * scale,
    },

    workoutContainer: {
      marginBottom: 14 * scale,
      padding: 14 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16 * scale,
    },

    nameButtonContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12 * scale,
      marginBottom: 14 * scale,
    },

    exerciseHeading: {
      flex: 1,
      alignItems: "flex-start",
    },

    exerciseName: {
      marginBottom: 7 * scale,
      color: theme.text,
      fontSize: 18 * scale,
      fontWeight: "700",
      lineHeight: 23 * scale,
    },

    musclePill: {
      maxWidth: "100%",
      paddingHorizontal: 8 * scale,
      paddingVertical: 4 * scale,
      backgroundColor: theme.buttonPrimary + "10",
      borderRadius: 8 * scale,
    },

    muscleName: {
      color: theme.buttonPrimary,
      fontSize: 12 * scale,
      fontWeight: "600",
    },

    removeExerciseButton: {
      width: 34 * scale,
      height: 34 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.error + "10",
      borderWidth: 1,
      borderColor: theme.error + "30",
      borderRadius: 10 * scale,
    },

    removeButtonPressed: {
      opacity: 0.65,
    },

    exerciseContainer: {
      marginBottom: 9 * scale,
      padding: 11 * scale,
      backgroundColor: theme.buttonSecondary,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 11 * scale,
    },

    setTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8 * scale,
      marginBottom: 10 * scale,
    },

    setHeader: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      minWidth: 0,
    },

    setNumberBadge: {
      width: 30 * scale,
      height: 30 * scale,
      marginRight: 9 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.buttonPrimary + "14",
      borderRadius: 9 * scale,
    },

    setNumber: {
      color: theme.buttonPrimary,
      fontSize: 13 * scale,
      fontWeight: "700",
    },

    previousContainer: {
      flex: 1,
      minWidth: 0,
    },

    previousLabel: {
      marginBottom: 2 * scale,
      color: theme.textSecondary,
      fontSize: 10 * scale,
      fontWeight: "500",
    },

    previousText: {
      color: theme.text,
      fontSize: 12 * scale,
      fontWeight: "600",
    },

    setActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6 * scale,
    },

    volumePill: {
      paddingHorizontal: 7 * scale,
      paddingVertical: 5 * scale,
      backgroundColor: theme.text + "08",
      borderRadius: 8 * scale,
    },

    volumeText: {
      color: theme.textSecondary,
      fontSize: 10 * scale,
      fontWeight: "600",
    },

    removeSetButton: {
      width: 28 * scale,
      height: 28 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.error + "10",
      borderRadius: 8 * scale,
    },

    inputsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    valueLabelContainer: {
      flex: 1,
      minHeight: 42 * scale,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 10 * scale,
      paddingVertical: 8 * scale,
      backgroundColor: theme.card,
      borderRadius: 10 * scale,
    },

    valueInput: {
      minWidth: 32 * scale,
      padding: 0,
      color: theme.text,
      fontSize: 16 * scale,
      fontWeight: "600",
      textAlign: "center",
    },

    labelText: {
      marginLeft: 4 * scale,
      color: theme.textSecondary,
      fontSize: 13 * scale,
      fontWeight: "500",
    },

    x: {
      marginHorizontal: 9 * scale,
      color: theme.textSecondary,
      fontSize: 17 * scale,
      fontWeight: "600",
    },

    secondaryButton: {
      minHeight: 38 * scale,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6 * scale,
      backgroundColor: theme.buttonPrimary + "0C",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "25",
      borderRadius: 10 * scale,
    },

    secondaryButtonText: {
      color: theme.buttonPrimary,
      fontSize: 12 * scale,
      fontWeight: "700",
    },

    button: {
      minHeight: 46 * scale,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8 * scale,
      backgroundColor: theme.buttonPrimary + "14",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "40",
      borderRadius: 12 * scale,
    },

    buttonText: {
      color: theme.buttonPrimary,
      fontSize: 14 * scale,
      fontWeight: "700",
    },

    actionButtonPressed: {
      opacity: 0.7,
    },
  });