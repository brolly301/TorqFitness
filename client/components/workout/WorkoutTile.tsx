import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Workout } from "@/types/Global";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import { capitalizeWords, formatDate, formatTime } from "@/utils/helpers";
import { useExerciseContext } from "@/context/ExerciseContext";
import WorkoutDetailsModal from "../modals/history/WorkoutDetailsModal";
import Feather from "@expo/vector-icons/Feather";

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

  const previewExercises = exerciseList.slice(0, 3);
  const remainingCount = exerciseList.length - previewExercises.length;

  const workoutDate = workout.startedAt
    ? formatDate(workout.startedAt)
    : "No date";

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
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTime}>{workoutDate}</Text>
        </View>

        <View style={styles.hr} />

        {previewExercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseContainer}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.buttonPrimary,
                marginRight: 8,
              }}
            />
            <Text style={styles.exerciseName} numberOfLines={1}>
              {capitalizeWords(exercise.details?.name ?? "Exercise")}
            </Text>
          </View>
        ))}

        {remainingCount > 0 && (
          <Text style={styles.moreText}>+{remainingCount} more</Text>
        )}
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
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
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

    exerciseContainer: {
      flexDirection: "row",
      marginBottom: 5 * scale,
      alignItems: "center",
    },

    exerciseName: {
      fontSize: 16 * scale,
      color: theme.text,
    },

    moreText: {
      marginTop: 4 * scale,
      fontSize: 15 * scale,
      color: theme.textSecondary,
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
