import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Workout } from "@/types/Global";
import WorkoutDetailsModal from "../modals/history/WorkoutDetailsModal";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  workout: Workout;
};

export default function ActivityTile({ workout }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

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
        <Text style={styles.date}>{workout.startedAt}</Text>
        {workout.exercises.map((exercise) => {
          return (
            <View style={styles.exerciseContainer}>
              <Text style={styles.exerciseName}>{exercise.exerciseId}</Text>
            </View>
          );
        })}
      </Pressable>
    </>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      borderRadius: 10 * scale,
      padding: 10 * scale,
      marginBottom: 10 * scale,
    },
    name: {
      color: theme.textPrimary,
      fontSize: 20 * scale,
      fontWeight: "600",
    },

    date: {
      fontSize: 14 * scale,
    },
    exerciseContainer: {},
    exerciseName: {},
  });
