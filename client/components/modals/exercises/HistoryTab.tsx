import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Exercise } from "@/types/Global";

type Props = {
  exercise: Exercise | null;
};

export default function HistoryTab({ exercise }: Props) {
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

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  dayContainer: {
    marginBottom: 24,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colContainer: {
    marginBottom: 4,
    alignItems: "center",
  },
  colLabel: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 10,
  },
  colText: { marginBottom: 10 },
});
