import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Workout } from "@/types/Global";
import WorkoutDetailsModal from "../modals/history/WorkoutDetailsModal";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useExerciseContext } from "@/context/ExerciseContext";
import { capitalizeWords, formatDate, formatTime } from "@/utils/helpers";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  workout: Workout;
};

export default function ActivityTile({ workout }: Props) {
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

  const workoutDate = workout.startedAt
    ? formatDate(workout.startedAt)
    : "No date";
  const workoutDuration = formatTime(workout.duration);

  return (
    <>
      <WorkoutDetailsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        workout={workout}
      />

      <Pressable style={styles.container} onPress={() => setModalVisible(true)}>
        <View style={styles.titleDuration}>
          <Text style={styles.name} numberOfLines={1}>
            {workout.name}
          </Text>

          <View style={styles.durationContainer}>
            <Feather name="clock" size={14} color={theme.buttonPrimary} />
            <Text style={styles.duration}>{formatTime(workout.duration)}</Text>
          </View>
        </View>
        <Text style={styles.dateTime}>{workoutDate}</Text>

        <View style={styles.hr} />

        {exerciseList.map((exercise) => {
          const setCount = exercise.sets.length;
          const setLabel = setCount === 1 ? "set" : "sets";

          return (
            <View key={exercise.id} style={styles.exerciseRow}>
              <Text style={styles.exerciseName} numberOfLines={1}>
                {capitalizeWords(exercise.details?.name ?? "Exercise")}
              </Text>

              <Text style={styles.exerciseSets}>
                {setCount} {setLabel}
              </Text>
            </View>
          );
        })}

        <View style={styles.hr} />

        <View style={styles.metaContainer}>
          <Text style={styles.meta}>{totalVolume} kg</Text>
          <Text style={styles.meta}> • </Text>

          <Text style={styles.meta}>{exerciseList.length} exercises</Text>
          <Text style={styles.meta}> • </Text>
          <Text style={styles.meta}>{totalSets} sets</Text>
        </View>
      </Pressable>
    </>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      borderRadius: 14 * scale,
      padding: 16 * scale,
      marginBottom: 12 * scale,
      borderWidth: 1,
      borderColor: theme.border,
    },

    name: {
      color: theme.text,
      fontSize: 18 * scale,
      fontWeight: "700",
      marginBottom: 4 * scale,
    },

    dateTimeContainer: {
      flexDirection: "row",
      marginBottom: 2 * scale,
    },

    dateTime: {
      fontSize: 14 * scale,
      color: theme.textSecondary,
    },

    hr: {
      height: 1,
      width: "100%",
      backgroundColor: theme.border,
      marginVertical: 10 * scale,
    },

    exerciseRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4 * scale,
      gap: 12 * scale,
    },

    exerciseName: {
      flex: 1,
      fontSize: 16 * scale,
      color: theme.text,
    },

    exerciseSets: {
      fontSize: 16 * scale,
      color: theme.text,
    },

    metaContainer: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
    },

    meta: {
      fontSize: 16 * scale,
      color: theme.text,
      fontWeight: "500",
    },
    durationContainer: {
      paddingHorizontal: 5,
      paddingVertical: 3,
      borderRadius: 10,
      backgroundColor: theme.buttonPrimary + "15",

      flexDirection: "row",
      alignItems: "center",
    },
    duration: {
      fontSize: 12,
      fontWeight: "400",
      color: theme.textSecondary,
      marginLeft: 5,
    },
    titleDuration: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
