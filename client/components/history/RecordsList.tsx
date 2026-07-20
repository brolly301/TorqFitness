import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Workout } from "@/types/Global";
import { useExerciseContext } from "@/context/ExerciseContext";
import RecordsTile, { ExerciseRecord } from "./RecordsTile";
import Feather from "@expo/vector-icons/Feather";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type Props = {
  workouts: Workout[];
};

export default function RecordsList({ workouts }: Props) {
  const { exercises } = useExerciseContext();
  
  const { theme, scale } = useAppTheme();
const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const records = useMemo(() => {
    const recordsByExercise = new Map<string, ExerciseRecord>();

    workouts.forEach((workout) => {
      workout.exercises.forEach((workoutExercise) => {
        const exerciseDetails = exercises.find(
          (exercise) => exercise.id === workoutExercise.exerciseId,
        );

        const currentRecord = recordsByExercise.get(
          workoutExercise.exerciseId,
        ) ?? {
          exerciseId: workoutExercise.exerciseId,
          exerciseName: exerciseDetails?.name ?? "Exercise",
          heaviestWeight: 0,
          bestSetWeight: 0,
          bestSetReps: 0,
          bestSetVolume: 0,
          estimatedOneRepMax: 0,
          lastPerformedAt: workout.completedAt ?? workout.startedAt ?? null,
        };

        workoutExercise.sets.forEach((set) => {
          const weight = Number(set.weight) || 0;
          const reps = Number(set.reps) || 0;
          const setVolume = weight * reps;

          // Epley estimated one-rep max
          const estimatedOneRepMax = reps > 0 ? weight * (1 + reps / 30) : 0;

          if (weight > currentRecord.heaviestWeight) {
            currentRecord.heaviestWeight = weight;
          }

          if (setVolume > currentRecord.bestSetVolume) {
            currentRecord.bestSetVolume = setVolume;
            currentRecord.bestSetWeight = weight;
            currentRecord.bestSetReps = reps;
          }

          if (estimatedOneRepMax > currentRecord.estimatedOneRepMax) {
            currentRecord.estimatedOneRepMax = estimatedOneRepMax;
          }
        });

        const workoutDate = workout.completedAt ?? workout.startedAt;

        if (
          workoutDate &&
          (!currentRecord.lastPerformedAt ||
            new Date(workoutDate) > new Date(currentRecord.lastPerformedAt))
        ) {
          currentRecord.lastPerformedAt = workoutDate;
        }

        recordsByExercise.set(workoutExercise.exerciseId, currentRecord);
      });
    });

    return Array.from(recordsByExercise.values()).sort((a, b) => {
      if (!a.lastPerformedAt) return 1;
      if (!b.lastPerformedAt) return -1;

      return (
        new Date(b.lastPerformedAt).getTime() -
        new Date(a.lastPerformedAt).getTime()
      );
    });
  }, [workouts, exercises]);

  if (records.length === 0) {
    return (
     <View style={styles.placeholder}>
  <View style={styles.placeholderIcon}>
    <Feather
      name="award"
      size={23 * scale}
      color={theme.buttonPrimary}
    />
  </View>

  <Text style={styles.placeholderTitle}>No records yet</Text>

  <Text style={styles.placeholderText}>
    Complete a workout to start building your exercise records.
  </Text>
</View>
    );
  }

  return (
    <FlatList
      data={records}
      keyExtractor={(item) => item.exerciseId}
      renderItem={({ item }) => <RecordsTile record={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    listContent: {
      paddingBottom: 32 * scale,
    },

    placeholder: {
      alignItems: "center",
      marginTop: 8 * scale,
      paddingVertical: 30 * scale,
      paddingHorizontal: 22 * scale,
      borderRadius: 18 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    placeholderIcon: {
      width: 50 * scale,
      height: 50 * scale,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 15 * scale,
      borderRadius: 15 * scale,
      backgroundColor: theme.buttonPrimary + "14",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "25",
    },

    placeholderTitle: {
      fontSize: 18 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 7 * scale,
    },

    placeholderText: {
      maxWidth: 280 * scale,
      fontSize: 14 * scale,
      lineHeight: 20 * scale,
      color: theme.textSecondary,
      textAlign: "center",
    },
  });