import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import {
  capitalizeWords,
  formatDate,
  formatWeight,
} from "@/utils/helpers";
import { useSettingsContext } from "@/context/SettingsContext";

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
  const { settings } = useSettingsContext();
  const weightUnit = settings?.weightLabel ?? "kg";

 return (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.name} numberOfLines={2}>
        {capitalizeWords(record.exerciseName)}
      </Text>

      <Text style={styles.lastPerformed}>
        {record.lastPerformedAt
          ? `Last performed ${formatDate(record.lastPerformedAt)}`
          : "Not performed yet"}
      </Text>
    </View>

    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Heaviest</Text>
        <Text style={styles.statValue} numberOfLines={1}>
          {formatWeight(record.heaviestWeight, weightUnit)}
        </Text>
      
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Best set</Text>
        <Text style={styles.statValue} numberOfLines={1}>
          {formatWeight(record.bestSetWeight, weightUnit)} ×{" "}
          {record.bestSetReps}
        </Text>
       
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Est. 1RM</Text>
        <Text style={styles.statValue} numberOfLines={1}>
          {formatWeight(record.estimatedOneRepMax, weightUnit)}
        </Text>
    
      </View>
    </View>
  </View>
);
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      padding: 16 * scale,
      marginBottom: 12 * scale,
      borderRadius: 16 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    header: {
      marginBottom: 14 * scale,
    },

    name: {
      fontSize: 18 * scale,
      lineHeight: 23 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 4 * scale,
    },

    lastPerformed: {
      fontSize: 13 * scale,
      color: theme.textSecondary,
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
      borderRadius: 12 * scale,
      backgroundColor: theme.buttonSecondary,
      borderWidth: 1,
      borderColor: theme.border,
    },

    statLabel: {
      fontSize: 11 * scale,
      fontWeight: "600",
      color: theme.textSecondary,
      marginBottom: 6 * scale,
    },

    statValue: {
      fontSize: 15 * scale,
      fontWeight: "700",
      color: theme.text,
    },

    statUnit: {
      fontSize: 10 * scale,
      color: theme.textMuted,
      marginTop: 2 * scale,
    },
  });