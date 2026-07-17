import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import { capitalizeWords } from "@/utils/helpers";

export type ExerciseRecord = {
  exerciseId: string;
  exerciseName: string;
  heaviestWeight: number;
  bestSetWeight: number;
  bestSetReps: number;
  bestSetVolume: number;
  estimatedOneRepMax: number;
  lastPerformedAt: string | null;
};

type Props = {
  record: ExerciseRecord;
};

export default function RecordsTile({ record }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{capitalizeWords(record.exerciseName)}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Heaviest weight</Text>
        <Text style={styles.value}>{record.heaviestWeight} kg</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Best set</Text>
        <Text style={styles.value}>
          {record.bestSetWeight} kg × {record.bestSetReps}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Estimated 1RM</Text>
        <Text style={styles.value}>
          {record.estimatedOneRepMax.toFixed(1)} kg
        </Text>
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14 * scale,
      padding: 16 * scale,
      marginBottom: 12 * scale,
    },

    name: {
      color: theme.text,
      fontSize: 18 * scale,
      fontWeight: "700",
      marginBottom: 12 * scale,
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 6 * scale,
    },

    label: {
      color: theme.textSecondary,
      fontSize: 14 * scale,
    },

    value: {
      color: theme.text,
      fontSize: 14 * scale,
      fontWeight: "600",
    },
  });
