import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Workout } from "@/types/Global";
import WorkoutDetailsModal from "../modals/history/WorkoutDetailsModal";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useExerciseContext } from "@/context/ExerciseContext";
import { capitalizeWords } from "@/utils/helpers";

type Props = {
  workout: Workout;
};

export default function ActivityTile({ workout }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { exercises } = useExerciseContext();

  const exerciseList = workout.exercises.map((we) => {
    const details = exercises.find((ex) => ex.id === we.exerciseId);

    return { ...we, details };
  });

  const totalSets = workout.exercises.reduce(
    (total, ex) => total + ex.sets.length,
    0,
  );

  const totalVolume = exerciseList.reduce((workoutTotal, exercise) => {
    const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
      return setTotal + Number(set.reps || 0) * Number(set.weight || 0);
    }, 0);

    return workoutTotal + exerciseVolume;
  }, 0);

  return (
    <>
      <WorkoutDetailsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        workout={workout}
      />

      <Pressable
        style={styles.container}
        onPress={() => setModalVisible(!modalVisible)}
      >
        <Text style={styles.name}>{workout.name}</Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTime}>Tue April 9</Text>
          <Text style={styles.dateTime}> • </Text>
          <Text style={styles.dateTime}>45mins</Text>
        </View>
        <View style={styles.hr} />
        {exerciseList.map((exercise) => {
          return (
            <View style={styles.exerciseContainer}>
              <Text style={styles.exerciseName}>
                {capitalizeWords(exercise.details?.name)}
              </Text>
              <Text style={styles.exerciseName}> • </Text>
              <Text style={styles.exerciseName}>
                {exercise.sets.length} sets
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
      borderRadius: 10 * scale,
      padding: 16 * scale,
      marginBottom: 10 * scale,
    },
    name: {
      color: theme.text,
      fontSize: 20 * scale,
      fontWeight: "600",
    },
    hr: {
      height: 1,
      width: "100%",
      backgroundColor: theme.border,
      marginVertical: 5,
    },
    dateTime: {
      fontSize: 14 * scale,
      color: theme.textSecondary,
    },
    dateTimeContainer: {
      flexDirection: "row",
    },
    meta: {
      fontSize: 16 * scale,

      color: theme.text,
    },
    metaContainer: {
      flexDirection: "row",
    },
    exerciseContainer: {
      flexDirection: "row",
    },
    exerciseName: {
      fontSize: 16 * scale,
      color: theme.text,
    },
  });
