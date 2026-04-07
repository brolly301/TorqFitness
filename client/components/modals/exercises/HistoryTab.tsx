import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { Exercise } from "@/types/Global";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  exercise: Exercise | null;
};

export default function HistoryTab({ exercise }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map((day) => (
        <View key={day} style={styles.dayContainer}>
          <Text style={styles.dateText}>Tues {day} October 2026</Text>
          <View style={styles.rowContainer}>
            <View style={styles.colContainer}>
              <Text style={styles.colLabel}>Set</Text>
              {[1, 2, 3].map((set) => (
                <View>
                  <Text style={styles.colText}>{set}</Text>
                </View>
              ))}
            </View>
            <View style={styles.colContainer}>
              <Text style={styles.colLabel}>Reps</Text>
              {[1, 2, 3].map((set) => (
                <View>
                  <Text style={styles.colText}>{set}</Text>
                </View>
              ))}
            </View>

            <View style={styles.colContainer}>
              <Text style={styles.colLabel}>Weight (kg)</Text>

              {[1, 2, 3].map((set) => (
                <View>
                  <Text style={styles.colText}>{set}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      padding: 16 * scale,
    },
    dayContainer: {
      marginBottom: 24 * scale,
    },
    dateText: {
      fontSize: 16 * scale,
      fontWeight: "600",
      marginBottom: 8 * scale,
    },
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    colContainer: {
      marginBottom: 4 * scale,
      alignItems: "center",
    },
    colLabel: {
      fontWeight: "600",
      fontSize: 14 * scale,
      marginBottom: 10 * scale,
    },
    colText: { marginBottom: 10 * scale },
  });
