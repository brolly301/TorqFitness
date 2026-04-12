import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { Exercise } from "@/types/Global";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { formatDate } from "@/utils/helpers";

type Props = {
  exercise: Exercise | null;
};

export default function HistoryTab({ exercise }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const { workouts } = useWorkoutContext();

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
        <Text style={styles.emptyText}>No exercise selected.</Text>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No history yet.</Text>
        <Text style={styles.emptySubtext}>
          Complete workouts with this exercise to see past sets, reps, and
          weight here.
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
          <Text style={styles.dateText}>
            {session.date ? formatDate(session.date) : "Unknown date"}
          </Text>

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
                {set.weight ?? 0} kg
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
      backgroundColor: theme.card,
      borderRadius: 14 * scale,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 14 * scale,
      marginBottom: 12 * scale,
    },

    dateText: {
      fontSize: 15 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 12 * scale,
    },

    tableHeader: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.buttonSecondary,
      borderRadius: 10 * scale,
      paddingVertical: 10 * scale,
      paddingHorizontal: 12 * scale,
      marginBottom: 6 * scale,
    },

    headerCell: {
      fontSize: 13 * scale,
      fontWeight: "600",
      color: theme.textSecondary,
    },

    tableRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12 * scale,
      paddingHorizontal: 12 * scale,
    },

    rowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    rowCell: {
      fontSize: 14 * scale,
      color: theme.text,
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
      paddingVertical: 24 * scale,
      alignItems: "center",
      justifyContent: "center",
    },

    emptyText: {
      fontSize: 15 * scale,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 4 * scale,
    },

    emptySubtext: {
      fontSize: 14 * scale,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 20 * scale,
    },
  });
