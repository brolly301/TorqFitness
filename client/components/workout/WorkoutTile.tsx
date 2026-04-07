import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Workout } from "@/types/Global";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type Props = {
  workout: Workout;
};

export default function WorkoutTile({ workout }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.name}>{workout.name}</Text>
        <Text style={styles.date}>{workout.startedAt}</Text>
      </View>
      <View>
        <Text style={styles.exercises}>{workout.exercises.length}</Text>
        <Text style={styles.volume}>5200kg</Text>
      </View>
      <Feather name="arrow-right" />
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "white",
      padding: 10 * scale,
      borderRadius: 10 * scale,
      marginBottom: 10 * scale,
    },
    name: {
      fontSize: 18 * scale,
      fontWeight: "600",
      marginBottom: 10 * scale,
    },
    date: {
      fontSize: 14 * scale,
      fontWeight: "400",
    },
    exercises: {
      fontSize: 16 * scale,
      fontWeight: "400",
      marginBottom: 10 * scale,
    },
    volume: {
      fontSize: 16 * scale,
      fontWeight: "400",
    },
  });
