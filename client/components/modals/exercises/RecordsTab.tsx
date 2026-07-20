import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Exercise } from "@/types/Global";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { useSettingsContext } from "@/context/SettingsContext";
import { formatDate, formatWeight } from "@/utils/helpers";

type Props = {
  exercise: Exercise | null;
};

export default function RecordsTab({ exercise }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { workouts } = useWorkoutContext();
  const { settings } = useSettingsContext();

  const weightUnit = settings?.weightLabel ?? "kg";

  const records = useMemo(() => {
    if (!exercise) return null;

    let heaviestWeight = 0;
    let bestSetWeight = 0;
    let bestSetReps = 0;
    let bestSetVolume = 0;
    let estimatedOneRepMax = 0;
    let totalSets = 0;
    let sessionCount = 0;
    let lastPerformedAt: string | null = null;

    workouts.forEach((workout) => {
      const matchedExercise = workout.exercises.find(
        (workoutExercise) => workoutExercise.exerciseId === exercise.id,
      );

      if (!matchedExercise) return;

      sessionCount += 1;
      totalSets += matchedExercise.sets.length;

      const workoutDate = workout.completedAt ?? workout.startedAt;

      if (
        workoutDate &&
        (!lastPerformedAt ||
          new Date(workoutDate).getTime() >
            new Date(lastPerformedAt).getTime())
      ) {
        lastPerformedAt = workoutDate;
      }

      matchedExercise.sets.forEach((set) => {
        const weight = Number(set.weight) || 0;
        const reps = Number(set.reps) || 0;
        const volume = weight * reps;
        const oneRepMax = reps > 0 ? weight * (1 + reps / 30) : 0;

        if (weight > heaviestWeight) {
          heaviestWeight = weight;
        }

        if (volume > bestSetVolume) {
          bestSetVolume = volume;
          bestSetWeight = weight;
          bestSetReps = reps;
        }

        if (oneRepMax > estimatedOneRepMax) {
          estimatedOneRepMax = oneRepMax;
        }
      });
    });

    if (sessionCount === 0 || totalSets === 0) return null;

    return {
      heaviestWeight,
      bestSetWeight,
      bestSetReps,
      estimatedOneRepMax,
      totalSets,
      sessionCount,
      lastPerformedAt,
    };
  }, [exercise, workouts]);

  if (!records) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Feather
            name="award"
            size={23 * scale}
            color={theme.buttonPrimary}
          />
        </View>

        <Text style={styles.emptyTitle}>No records yet</Text>

        <Text style={styles.emptyText}>
          Complete a workout with this exercise to start building records.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryHeader}>
        <View>
          <Text style={styles.heading}>Personal Records</Text>

          <Text style={styles.lastPerformed}>
            {records.lastPerformedAt
              ? `Last performed ${formatDate(records.lastPerformedAt)}`
              : "Not performed yet"}
          </Text>
        </View>

        <View style={styles.sessionPill}>
          <Text style={styles.sessionText}>
            {records.sessionCount}{" "}
            {records.sessionCount === 1 ? "session" : "sessions"}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Heaviest</Text>
          <Text style={styles.statValue}>
            {formatWeight(records.heaviestWeight, weightUnit)}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Best Set</Text>
          <Text style={styles.statValue}>
            {formatWeight(records.bestSetWeight, weightUnit)} ×{" "}
            {records.bestSetReps}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Estimated 1RM</Text>
          <Text style={styles.statValue}>
            {formatWeight(records.estimatedOneRepMax, weightUnit)}
          </Text>
        </View>
      </View>

      <View style={styles.setSummary}>
        <Feather
          name="layers"
          size={15 * scale}
          color={theme.buttonPrimary}
        />

        <Text style={styles.setSummaryText}>
          Based on {records.totalSets}{" "}
          {records.totalSets === 1 ? "completed set" : "completed sets"}
        </Text>
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      padding: 14 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14 * scale,
    },

    summaryHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 10 * scale,
      marginBottom: 14 * scale,
    },

    heading: {
      marginBottom: 3 * scale,
      color: theme.text,
      fontSize: 16 * scale,
      fontWeight: "700",
    },

    lastPerformed: {
      color: theme.textSecondary,
      fontSize: 12 * scale,
    },

    sessionPill: {
      paddingHorizontal: 8 * scale,
      paddingVertical: 5 * scale,
      backgroundColor: theme.buttonPrimary + "12",
      borderRadius: 9 * scale,
    },

    sessionText: {
      color: theme.buttonPrimary,
      fontSize: 11 * scale,
      fontWeight: "600",
    },

    statsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8 * scale,
    },

    statCard: {
      flexGrow: 1,
      flexBasis: "30%",
      minWidth: 88 * scale,
      paddingHorizontal: 10 * scale,
      paddingVertical: 11 * scale,
      backgroundColor: theme.text + "08",
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 11 * scale,
    },

    statLabel: {
      marginBottom: 6 * scale,
      color: theme.textSecondary,
      fontSize: 11 * scale,
      fontWeight: "600",
    },

    statValue: {
      color: theme.text,
      fontSize: 14 * scale,
      fontWeight: "700",
    },

    setSummary: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7 * scale,
      marginTop: 12 * scale,
      paddingTop: 12 * scale,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },

    setSummaryText: {
      color: theme.textSecondary,
      fontSize: 12 * scale,
    },

    emptyContainer: {
      alignItems: "center",
      paddingHorizontal: 20 * scale,
      paddingVertical: 28 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14 * scale,
    },

    emptyIcon: {
      width: 48 * scale,
      height: 48 * scale,
      marginBottom: 14 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.buttonPrimary + "14",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "25",
      borderRadius: 15 * scale,
    },

    emptyTitle: {
      marginBottom: 6 * scale,
      color: theme.text,
      fontSize: 17 * scale,
      fontWeight: "700",
    },

    emptyText: {
      maxWidth: 270 * scale,
      color: theme.textSecondary,
      fontSize: 14 * scale,
      lineHeight: 20 * scale,
      textAlign: "center",
    },
  });