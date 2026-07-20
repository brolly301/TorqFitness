import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { Exercise } from "@/types/Global";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { formatDate, formatWeight } from "@/utils/helpers";
import { useSettingsContext } from "@/context/SettingsContext";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  exercise: Exercise | null;
};

export default function HistoryTab({ exercise }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const { workouts } = useWorkoutContext();
  
  const { settings } = useSettingsContext();
const weightUnit = settings?.weightLabel ?? "kg";

  const history = useMemo(() => {
    if (!exercise) return [];

    return workouts
      .filter((workout) =>
        workout.exercises.some((workoutExercise) => {
          return workoutExercise.exerciseId === exercise.id;
        }),
      )
      .map((workout) => {
        const matchedExercise = workout.exercises.find((workoutExercise) => {
          return workoutExercise.exerciseId === exercise.id;
        });

       return {
  workoutId: workout.id,
  workoutName: workout.name,
  date: workout.completedAt ?? workout.startedAt ?? "",
  sets: matchedExercise?.sets ?? [],
};
      })
      .sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [workouts, exercise]);

  if (!exercise) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Feather
          name="clock"
          size={23 * scale}
          color={theme.buttonPrimary}
        />
      </View>

      <Text style={styles.emptyTitle}>No exercise selected</Text>

      <Text style={styles.emptySubtext}>
        Select an exercise to view its workout history.
      </Text>
    </View>
  );
}

if (history.length === 0) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Feather
          name="clock"
          size={23 * scale}
          color={theme.buttonPrimary}
        />
      </View>

      <Text style={styles.emptyTitle}>No history yet</Text>

      <Text style={styles.emptySubtext}>
        Complete a workout with this exercise to see your previous sets,
        reps, and weight.
      </Text>
    </View>
  );
}

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {history.map((session) => (
        <View key={session.workoutId} style={styles.sessionCard}>
         <View style={styles.sessionHeader}>
  <View style={styles.sessionTitleContainer}>
    <Text style={styles.workoutName} numberOfLines={1}>
      {session.workoutName}
    </Text>

    <Text style={styles.dateText}>
      {session.date ? formatDate(session.date) : "Unknown date"}
    </Text>
  </View>

  <View style={styles.setCountPill}>
    <Text style={styles.setCountText}>
      {session.sets.length} {session.sets.length === 1 ? "set" : "sets"}
    </Text>
  </View>
</View>

          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.setColumn]}>Set</Text>
            <Text style={[styles.headerCell, styles.repsColumn]}>Reps</Text>
            <Text style={[styles.headerCell, styles.weightColumn]}>Weight</Text>
          </View>

          {session.sets.map((set, index) => (
            <View
              key={set.id}
              style={[
                styles.tableRow,
                index !== session.sets.length - 1 && styles.rowDivider,
              ]}
            >
              <Text style={[styles.rowCell, styles.setColumn]}>
                {set.order}
              </Text>
              <Text style={[styles.rowCell, styles.repsColumn]}>
                {set.reps ?? 0}
              </Text>
              <Text style={[styles.rowCell, styles.weightColumn]}>
             {formatWeight(set.weight ?? 0, weightUnit)}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    contentContainer: {
      paddingBottom: 16 * scale,
    },

    sessionCard: {
      marginBottom: 12 * scale,
      padding: 14 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14 * scale,
    },

    sessionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10 * scale,
      marginBottom: 12 * scale,
    },

    sessionTitleContainer: {
      flex: 1,
    },

    workoutName: {
      marginBottom: 3 * scale,
      color: theme.text,
      fontSize: 15 * scale,
      fontWeight: "700",
    },

    dateText: {
      color: theme.textSecondary,
      fontSize: 13 * scale,
    },

    setCountPill: {
      paddingHorizontal: 8 * scale,
      paddingVertical: 5 * scale,
      backgroundColor: theme.buttonPrimary + "12",
      borderRadius: 9 * scale,
    },

    setCountText: {
      color: theme.buttonPrimary,
      fontSize: 12 * scale,
      fontWeight: "600",
    },

    tableHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4 * scale,
      paddingHorizontal: 12 * scale,
      paddingVertical: 9 * scale,
      backgroundColor: theme.text + "08",
      borderRadius: 9 * scale,
    },

    headerCell: {
      color: theme.textSecondary,
      fontSize: 12 * scale,
      fontWeight: "600",
    },

    tableRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12 * scale,
      paddingVertical: 11 * scale,
    },

    rowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    rowCell: {
      color: theme.text,
      fontSize: 14 * scale,
    },

    setColumn: {
      width: 52 * scale,
    },

    repsColumn: {
      flex: 1,
    },

    weightColumn: {
      width: 90 * scale,
      textAlign: "right",
    },

    emptyContainer: {
      alignItems: "center",
      paddingHorizontal: 22 * scale,
      paddingVertical: 30 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14 * scale,
    },

    emptyIcon: {
      width: 50 * scale,
      height: 50 * scale,
      marginBottom: 15 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.buttonPrimary + "14",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "25",
      borderRadius: 15 * scale,
    },

    emptyTitle: {
      marginBottom: 7 * scale,
      color: theme.text,
      fontSize: 17 * scale,
      fontWeight: "700",
      textAlign: "center",
    },

    emptySubtext: {
      maxWidth: 280 * scale,
      color: theme.textSecondary,
      fontSize: 14 * scale,
      lineHeight: 20 * scale,
      textAlign: "center",
    },
  });