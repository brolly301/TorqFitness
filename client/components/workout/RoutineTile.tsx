import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Routine } from "@/types/Global";
import { router } from "expo-router";
import { useWorkoutContext } from "@/context/WorkoutContext";
import * as crypto from "expo-crypto";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type Props = {
  routine: Routine;
};

export default function RoutineTile({ routine }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { setWorkout, workout } = useWorkoutContext();

  const loadRoutine = () => {
    setWorkout((prev) => ({
      ...prev,
      ...routine,
      id: crypto.randomUUID(),
      exercises: routine.exercises.map((ex, i) => ({
        ...ex,
        id: crypto.randomUUID(),
        order: i + 1,
        sets: ex.sets.map((set, j) => ({
          ...set,
          id: crypto.randomUUID(),
          order: j + 1,
        })),
      })),
    }));
    router.navigate("/workout/createWorkout");
  };

  return (
    <Pressable style={styles.container} onPress={loadRoutine}>
      <View>
        <Text style={styles.name}>{routine.name}</Text>
        <Text style={styles.date}>Last used - Monday, 10:39</Text>
      </View>
      <View>
        <Text style={styles.exercises}>
          {routine.exercises.length} exercises
        </Text>
        <Text style={styles.volume}>Chest, Triceps</Text>
      </View>
      <Feather name="arrow-right" />
    </Pressable>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.background,
      padding: 10 * scale,
      borderRadius: 10,
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
