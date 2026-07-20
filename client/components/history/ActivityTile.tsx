import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Workout } from "@/types/Global";
import WorkoutDetailsModal from "../modals/history/WorkoutDetailsModal";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useExerciseContext } from "@/context/ExerciseContext";
import {
  capitalizeWords,
  formatDate,
  formatTime,
  toDisplayWeight,
} from "@/utils/helpers";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSettingsContext } from "@/context/SettingsContext";

type Props = {
  workout: Workout;
};

export default function ActivityTile({ workout }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const [modalVisible, setModalVisible] = useState(false);
  const { exercises } = useExerciseContext();

  const { settings } = useSettingsContext();
  const weightUnit = settings?.weightLabel ?? "kg";

  const exerciseList = useMemo(() => {
    return workout.exercises.map((we) => {
      const details = exercises.find((ex) => ex.id === we.exerciseId);
      return { ...we, details };
    });
  }, [workout.exercises, exercises]);

  const totalSets = useMemo(() => {
    return workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  }, [workout.exercises]);

  const totalVolume = useMemo(() => {
    return exerciseList.reduce((workoutTotal, exercise) => {
      const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
        return setTotal + Number(set.reps || 0) * Number(set.weight || 0);
      }, 0);

      return workoutTotal + exerciseVolume;
    }, 0);
  }, [exerciseList]);

  const displayedTotalVolume = toDisplayWeight(totalVolume, weightUnit);

  const workoutDate = workout.startedAt
    ? formatDate(workout.startedAt)
    : "No date";
  const workoutDuration = formatTime(workout.duration);

  const exerciseCount = exerciseList.length;
  const exerciseLabel = exerciseCount === 1 ? "exercise" : "exercises";

  const setLabel = totalSets === 1 ? "set" : "sets";

  const previewExercises = exerciseList.slice(0, 2);
  const remainingExerciseCount = exerciseList.length - previewExercises.length;

  return (
    <>
     <WorkoutDetailsModal
  modalVisible={modalVisible}
  setModalVisible={setModalVisible}
  workout={workout}
  returnTo="/(tabs)/history"
/>

<Pressable
  style={({ pressed }) => [
    styles.container,
    pressed && styles.containerPressed,
  ]}
  onPress={() => setModalVisible(true)}
>
  <View style={styles.header}>
    <View style={styles.headerText}>
      <Text style={styles.name} numberOfLines={1}>
        {workout.name}
      </Text>

      <Text style={styles.date}>{workoutDate}</Text>
    </View>

    <View style={styles.durationPill}>
      <Feather
        name="clock"
        size={13 * scale}
        color={theme.buttonPrimary}
      />
      <Text style={styles.duration}>{workoutDuration}</Text>
    </View>
  </View>

  <View style={styles.statsContainer}>
    <View style={styles.statPill}>
      <Text style={styles.statText}>
        {displayedTotalVolume} {weightUnit}
      </Text>
    </View>

    <View style={styles.statPill}>
      <Text style={styles.statText}>
        {exerciseCount} {exerciseLabel}
      </Text>
    </View>

    <View style={styles.statPill}>
      <Text style={styles.statText}>
        {totalSets} {setLabel}
      </Text>
    </View>
  </View>

  {previewExercises.length > 0 ? (
    <View style={styles.exercisePreview}>
      {previewExercises.map((exercise) => {
        const setCount = exercise.sets.length;

        return (
          <View key={exercise.id} style={styles.exerciseRow}>
            <Text style={styles.exerciseName} numberOfLines={1}>
              {capitalizeWords(exercise.details?.name ?? "Exercise")}
            </Text>

            <Text style={styles.exerciseSets}>
              {setCount} {setCount === 1 ? "set" : "sets"}
            </Text>
          </View>
        );
      })}

      {remainingExerciseCount > 0 ? (
        <Text style={styles.moreExercises}>
          +{remainingExerciseCount} more
        </Text>
      ) : null}
    </View>
  ) : (
    <View style={styles.placeholderContainer}>
      <MaterialCommunityIcons
        name="dumbbell"
        color={theme.textSecondary}
        size={16 * scale}
      />
      <Text style={styles.placeholderText}>No exercises added</Text>
    </View>
  )}
</Pressable>
    </>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      padding: 16 * scale,
      marginBottom: 12 * scale,
      borderRadius: 16 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    containerPressed: {
      opacity: 0.78,
    },

    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },

    headerText: {
      flex: 1,
      marginRight: 12 * scale,
    },

    name: {
      fontSize: 18 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 3 * scale,
    },

    date: {
      fontSize: 13 * scale,
      color: theme.textSecondary,
    },

    durationPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5 * scale,
      paddingHorizontal: 8 * scale,
      paddingVertical: 5 * scale,
      borderRadius: 999,
      backgroundColor: theme.buttonPrimary + "12",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "25",
    },

    duration: {
      fontSize: 12 * scale,
      fontWeight: "600",
      color: theme.buttonPrimary,
    },

    statsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 7 * scale,
      marginTop: 14 * scale,
    },

    statPill: {
      paddingHorizontal: 9 * scale,
      paddingVertical: 5 * scale,
      borderRadius: 999,
      backgroundColor: theme.buttonSecondary,
      borderWidth: 1,
      borderColor: theme.border,
    },

    statText: {
      fontSize: 12 * scale,
      fontWeight: "600",
      color: theme.textSecondary,
    },

    exercisePreview: {
      gap: 7 * scale,
      marginTop: 14 * scale,
    },

    exerciseRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12 * scale,
    },

    exerciseName: {
      flex: 1,
      fontSize: 14 * scale,
      fontWeight: "500",
      color: theme.text,
    },

    exerciseSets: {
      fontSize: 13 * scale,
      color: theme.textSecondary,
    },

    moreExercises: {
      fontSize: 13 * scale,
      fontWeight: "600",
      color: theme.buttonPrimary,
      marginTop: 1 * scale,
    },

    placeholderContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 14 * scale,
    },

    placeholderText: {
      fontSize: 13 * scale,
      color: theme.textSecondary,
      marginLeft: 8 * scale,
    },
  });