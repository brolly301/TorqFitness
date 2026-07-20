import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Workout } from "@/types/Global";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import { capitalizeWords, formatDate, formatTime } from "@/utils/helpers";
import { useExerciseContext } from "@/context/ExerciseContext";
import WorkoutDetailsModal from "../modals/history/WorkoutDetailsModal";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type Props = {
  workout: Workout;
};

export default function WorkoutTile({ workout }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const [modalVisible, setModalVisible] = useState(false);
  const { exercises } = useExerciseContext();

  const exerciseList = useMemo(() => {
    return workout.exercises.map((we) => {
      const details = exercises.find((ex) => ex.id === we.exerciseId);
      return { ...we, details };
    });
  }, [workout.exercises, exercises]);

  const previewExercises = exerciseList.slice(0, 2);
  const remainingCount = exerciseList.length - previewExercises.length;
const totalSets = workout.exercises.reduce(
  (total, exercise) => total + exercise.sets.length,
  0,
);

const exerciseLabel =
  workout.exercises.length === 1 ? "exercise" : "exercises";

const setLabel = totalSets === 1 ? "set" : "sets";

  const workoutDate = workout.startedAt
    ? formatDate(workout.startedAt)
    : "No date";

  return (
    <>
      <WorkoutDetailsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        workout={workout}
          returnTo="/(tabs)/workout"
      />

    <Pressable
  style={({ pressed }) => [
    styles.container,
    pressed && styles.containerPressed,
  ]}
  onPress={() => setModalVisible(true)}
>
  <View style={styles.header}>
    <View style={styles.titleContainer}>
      <Text style={styles.name} numberOfLines={1}>
        {workout.name}
      </Text>

      <Text style={styles.date}>{workoutDate}</Text>
    </View>

    <Feather
      name="chevron-right"
      size={18 * scale}
      color={theme.textSecondary}
    />
  </View>

  <View style={styles.statsContainer}>
    <View style={styles.stat}>
      <Feather
        name="clock"
        size={13 * scale}
        color={theme.buttonPrimary}
      />
      <Text style={styles.statText}>
        {formatTime(workout.duration)}
      </Text>
    </View>

    <View style={styles.stat}>
      <MaterialCommunityIcons
        name="dumbbell"
        size={14 * scale}
        color={theme.buttonPrimary}
      />
      <Text style={styles.statText}>
        <Text style={styles.statText}>
  {workout.exercises.length} {exerciseLabel}
</Text>
      </Text>
    </View>

    <View style={styles.stat}>
      <Feather
        name="layers"
        size={13 * scale}
        color={theme.buttonPrimary}
      />
    <Text style={styles.statText}>
  {totalSets} {setLabel}
</Text>
    </View>
  </View>

  {previewExercises.length > 0 ? (
    <View style={styles.exerciseList}>
      {previewExercises.map((exercise) => (
        <View key={exercise.id} style={styles.exerciseRow}>
          <View style={styles.exerciseDot} />

          <Text style={styles.exerciseName} numberOfLines={1}>
            {capitalizeWords(exercise.details?.name ?? "Exercise")}
          </Text>
        </View>
      ))}

      {remainingCount > 0 && (
        <Text style={styles.moreText}>+{remainingCount} more</Text>
      )}
    </View>
  ) : (
    <View style={styles.placeholderContainer}>
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
      marginBottom: 12 * scale,
      padding: 15 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16 * scale,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },

    containerPressed: {
      opacity: 0.75,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    titleContainer: {
      flex: 1,
      marginRight: 12 * scale,
    },

    name: {
      marginBottom: 3 * scale,
      color: theme.text,
      fontSize: 17 * scale,
      fontWeight: "700",
    },

    date: {
      color: theme.textSecondary,
      fontSize: 13 * scale,
    },

    statsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 7 * scale,
      marginTop: 12 * scale,
    },

    stat: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5 * scale,
      paddingHorizontal: 8 * scale,
      paddingVertical: 5 * scale,
      backgroundColor: theme.buttonPrimary + "10",
      borderRadius: 9 * scale,
    },

    statText: {
      color: theme.textSecondary,
      fontSize: 12 * scale,
      fontWeight: "500",
    },

    exerciseList: {
      gap: 7 * scale,
      marginTop: 13 * scale,
      paddingTop: 12 * scale,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },

    exerciseRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    exerciseDot: {
      width: 5 * scale,
      height: 5 * scale,
      marginRight: 9 * scale,
      backgroundColor: theme.buttonPrimary,
      borderRadius: 3 * scale,
    },

    exerciseName: {
      flex: 1,
      color: theme.text,
      fontSize: 14 * scale,
      fontWeight: "500",
    },

    moreText: {
      marginLeft: 14 * scale,
      color: theme.textSecondary,
      fontSize: 13 * scale,
      fontWeight: "500",
    },

    placeholderContainer: {
      marginTop: 12 * scale,
      paddingTop: 12 * scale,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },

    placeholderText: {
      color: theme.textSecondary,
      fontSize: 13 * scale,
    },
  });