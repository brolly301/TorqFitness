import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import TileWrapper from "./TileWrapper";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import { useWorkoutContext } from "@/context/WorkoutContext";

export default function StatsTile() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { workouts } = useWorkoutContext();

  return (
    <TileWrapper>
      <View style={styles.container}>
        <View style={styles.valueContainer}>
          <Text style={styles.label}>Weight</Text>
          <Text style={styles.value}>
            76.2 <Text style={styles.subValue}>kg</Text>
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
            6 <Text style={styles.subValue}>days</Text>
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
