import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Routine } from "@/types/Global";
import Feather from "@expo/vector-icons/Feather";
import RoutineDetailsModal from "../modals/routines/RoutineDetailsModal";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useExerciseContext } from "@/context/ExerciseContext";
import { capitalizeWords } from "@/utils/helpers";

type Props = {
  routine: Routine;
};

export default function RoutineTile({ routine }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const { exercises } = useExerciseContext();

  const [modalVisible, setModalVisible] = useState(false);

  const totalSets = useMemo(() => {
    return routine.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  }, [routine.exercises]);

  const muscleGroups = useMemo(() => {
    const groups = routine.exercises.flatMap((routineExercise) => {
      const exercise = exercises.find(
        (item) => item.id === routineExercise.exerciseId,
      );

      return exercise?.primaryMuscles ?? [];
    });

    return [...new Set(groups)].slice(0, 3).map(capitalizeWords).join(" • ");
  }, [routine.exercises, exercises]);

  return (
    <>
      <RoutineDetailsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        routine={routine}
      />

      <Pressable style={styles.container} onPress={() => setModalVisible(true)}>
        <View style={styles.highlight} />

        <View style={styles.contentContainer}>
          <View style={styles.routineTopDetails}>
            <View style={styles.nameContainer}>
              <Text style={styles.name} numberOfLines={1}>
                {routine.name}
              </Text>

              <Text style={styles.volume} numberOfLines={1}>
                {muscleGroups || "No muscle groups"}
              </Text>
            </View>

            <Feather
              name="arrow-right"
              size={18 * scale}
              color={theme.textSecondary}
            />
          </View>

          <View style={styles.hr} />

          <View style={styles.routineBottomDetails}>
            <Text style={styles.meta}>
              {routine.exercises.length} exercises • {totalSets} sets
            </Text>

            <Text style={styles.date}>
              {routine.lastUsedAt
                ? `Last used • ${new Date(routine.lastUsedAt).toLocaleDateString()}`
                : "Never used"}
            </Text>
          </View>
        </View>
      </Pressable>
    </>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: theme.card,
      borderRadius: 14 * scale,
      marginBottom: 12 * scale,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.border,
    },

    highlight: {
      backgroundColor: theme.buttonPrimary,
      width: 5 * scale,
    },

    contentContainer: {
      flex: 1,
      padding: 14 * scale,
    },

    routineTopDetails: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    nameContainer: {
      flex: 1,
      marginRight: 12 * scale,
    },

    name: {
      fontSize: 18 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 2 * scale,
    },

    volume: {
      fontSize: 14 * scale,
      color: theme.textSecondary,
    },

    hr: {
      height: 1,
      width: "100%",
      backgroundColor: theme.border,
      marginVertical: 8 * scale,
    },

    routineBottomDetails: {
      gap: 2 * scale,
    },

    meta: {
      fontSize: 14 * scale,
      color: theme.textSecondary,
    },

    date: {
      fontSize: 13 * scale,
      color: theme.textSecondary,
    },
  });
