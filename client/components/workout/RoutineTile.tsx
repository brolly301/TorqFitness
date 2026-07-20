import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Routine } from "@/types/Global";
import { router } from "expo-router";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import RoutineDetailsModal from "../modals/routines/RoutineDetailsModal";
import { useExerciseContext } from "@/context/ExerciseContext";
import { capitalizeWords, formatDate } from "@/utils/helpers";

type Props = {
  routine: Routine;
};

export default function RoutineTile({ routine }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { exercises } = useExerciseContext();
  const exerciseCount = routine.exercises.length;
  const exerciseLabel = exerciseCount === 1 ? "exercise" : "exercises";

  const lastUsedText = routine.lastUsedAt
  ? `Last used ${formatDate(routine.lastUsedAt)}`
  : "Not used yet";

  const muscleGroups = useMemo(() => {
    const groups = routine.exercises.flatMap((routineExercise) => {
      const exercise = exercises.find(
        (item) => item.id === routineExercise.exerciseId,
      );

      return exercise?.primaryMuscles ?? [];
    });

    return [...new Set(groups)].slice(0, 2).map(capitalizeWords).join(" • ");
  }, [routine.exercises, exercises]);

  return (
    <>
      <RoutineDetailsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        routine={routine}
        returnTo="/(tabs)/workout"
      />

     <Pressable
  style={({ pressed }) => [
    styles.container,
    pressed && styles.containerPressed,
  ]}
  onPress={() => setModalVisible(true)}
>


  <View style={styles.content}>
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {routine.name}
        </Text>

        <Text style={styles.subText} numberOfLines={1}>
          {lastUsedText}
        </Text>
      </View>

      <Feather
        name="chevron-right"
        size={18 * scale}
        color={theme.textSecondary}
      />
    </View>

    <View style={styles.metaContainer}>
      <View style={styles.metaPill}>
        <Text style={styles.metaText}>
          {exerciseCount} {exerciseLabel}
        </Text>
      </View>

      {muscleGroups ? (
        <View style={styles.musclePill}>
          <Text style={styles.muscleText} numberOfLines={1}>
            {muscleGroups}
          </Text>
        </View>
      ) : null}
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
      alignItems: "center",
      marginBottom: 12 * scale,
      padding: 14 * scale,
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

    content: {
      flex: 1,
      minWidth: 0,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
    },

    titleContainer: {
      flex: 1,
      marginRight: 10 * scale,
    },

    name: {
      marginBottom: 3 * scale,
      color: theme.text,
      fontSize: 17 * scale,
      fontWeight: "700",
    },

    subText: {
      color: theme.textSecondary,
      fontSize: 13 * scale,
    },

    metaContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 7 * scale,
      marginTop: 11 * scale,
    },

   metaPill: {
  paddingHorizontal: 8 * scale,
  paddingVertical: 5 * scale,
  backgroundColor: theme.text + "08",
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 9 * scale,
},

    metaText: {
      color: theme.textSecondary,
      fontSize: 12 * scale,
      fontWeight: "500",
    },

    musclePill: {
      flexShrink: 1,
      paddingHorizontal: 8 * scale,
      paddingVertical: 5 * scale,
      backgroundColor: theme.buttonPrimary + "10",
      borderRadius: 9 * scale,
    },

    muscleText: {
      color: theme.buttonPrimary,
      fontSize: 12 * scale,
      fontWeight: "500",
    },
  });