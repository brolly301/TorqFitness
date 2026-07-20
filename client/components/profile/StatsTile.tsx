import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import TileWrapper from "./TileWrapper";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { useUserContext } from "@/context/UserContext";
import { useSettingsContext } from "@/context/SettingsContext";
import {
  getLocalDateKey,
  toDisplayWeight,
} from "@/utils/helpers";

export default function StatsTile() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

const { user } = useUserContext();
const { settings } = useSettingsContext();
const { workouts } = useWorkoutContext();

const weightUnit = settings?.weightLabel ?? "kg";

const displayedWeight =
  user?.currentWeightKg != null
    ? toDisplayWeight(user.currentWeightKg, weightUnit)
    : null;
    
    const workoutStreak = useMemo(() => {
  const workoutDates = new Set(
    workouts
      .filter((workout) => workout.completedAt)
      .map((workout) =>
        getLocalDateKey(workout.completedAt as string),
      ),
  );

  if (workoutDates.size === 0) return 0;

  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);

  // A streak remains active if the latest workout was today
  // or yesterday.
  if (!workoutDates.has(getLocalDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);

    if (!workoutDates.has(getLocalDateKey(cursor))) {
      return 0;
    }
  }

  let streak = 0;

  while (workoutDates.has(getLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}, [workouts]);

  return (
    <TileWrapper>
      <View style={styles.container}>
        <View style={styles.valueContainer}>
          <Text style={styles.label}>Weight</Text>
         <Text style={styles.value}>
  {displayedWeight ?? "—"}

  {displayedWeight != null && (
    <Text style={styles.subValue}> {weightUnit}</Text>
  )}
</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.valueContainer}>
          <Text style={styles.label}>Workouts</Text>
          <Text style={styles.value}>{workouts.length}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.valueContainer}>
          <Text style={styles.label}>Streak</Text>
        <Text style={styles.value}>
  {workoutStreak}{" "}
  <Text style={styles.subValue}>
    {workoutStreak === 1 ? "day" : "days"}
  </Text>
</Text>
        </View>
      </View>
    </TileWrapper>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8 * scale,
      paddingVertical: 18 * scale,
    },

    valueContainer: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 4 * scale,
    },

    label: {
      marginBottom: 6 * scale,
      color: theme.textSecondary,
      fontSize: 12 * scale,
      fontWeight: "600",
    },

    value: {
      color: theme.text,
      fontSize: 21 * scale,
      fontWeight: "700",
    },

    subValue: {
      color: theme.textSecondary,
      fontSize: 12 * scale,
      fontWeight: "500",
    },

    separator: {
      width: 1,
      height: 32 * scale,
      backgroundColor: theme.border,
    },
  });