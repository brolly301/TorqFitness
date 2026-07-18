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
      paddingVertical: 18 * scale,
    },

    valueContainer: {
      flex: 1,
      alignItems: "center",
    },

    label: {
      fontSize: 16 * scale,
      fontWeight: "500",
      marginBottom: 4 * scale,
      color: theme.textSecondary,
    },

    value: {
      fontSize: 22 * scale,
      fontWeight: "600",
      color: theme.buttonPrimary,
    },

    subValue: {
      fontSize: 14 * scale,
      fontWeight: "500",
      color: theme.text,
    },

    separator: {
      width: 1,
      height: 28 * scale,
      backgroundColor: theme.border,
      opacity: 0.6,
    },
  });
