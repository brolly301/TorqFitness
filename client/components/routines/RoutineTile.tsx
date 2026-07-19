import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Routine } from "@/types/Global";
import Feather from "@expo/vector-icons/Feather";
import RoutineDetailsModal from "../modals/routines/RoutineDetailsModal";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useExerciseContext } from "@/context/ExerciseContext";
import { capitalizeWords } from "@/utils/helpers";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
        returnTo="/(tabs)/routines"
      />
<Pressable
  style={({ pressed }) => [
    styles.container,
    pressed && styles.containerPressed,
  ]}
  onPress={() => setModalVisible(true)}
>
  <View style={styles.topRow}>
    <View style={styles.iconContainer}>
      <Text style={styles.initial}>
  {routine.name.trim().charAt(0).toUpperCase() || "R"}
</Text>
    </View>

    <View style={styles.mainContent}>
      <Text style={styles.name} numberOfLines={1}>
        {routine.name}
      </Text>

      <Text style={styles.muscles} numberOfLines={1}>
        {muscleGroups || "No muscle groups"}
      </Text>
    </View>

    <Feather
      name="chevron-right"
      size={20 * scale}
      color={theme.textSecondary}
    />
  </View>

  <View style={styles.bottomRow}>
    <View style={styles.statsContainer}>
      <View style={styles.statPill}>
        <Text style={styles.statText}>
          {routine.exercises.length}{" "}
          {routine.exercises.length === 1 ? "exercise" : "exercises"}
        </Text>
      </View>

      <View style={styles.statPill}>
        <Text style={styles.statText}>
          {totalSets} {totalSets === 1 ? "set" : "sets"}
        </Text>
      </View>
    </View>

    <Text style={styles.date} numberOfLines={1}>
      {routine.lastUsedAt
        ? `Used ${new Date(routine.lastUsedAt).toLocaleDateString()}`
        : "Never used"}
    </Text>
  </View>
</Pressable>
     
    </>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
  container: {
  backgroundColor: theme.card,
  borderRadius: 16 * scale,
  padding: 15 * scale,
  marginBottom: 12 * scale,
  borderWidth: 1,
  borderColor: theme.border,
},

containerPressed: {
  opacity: 0.78,
},

topRow: {
  flexDirection: "row",
  alignItems: "center",
},

iconContainer: {
  width: 44 * scale,
  height: 44 * scale,
  borderRadius: 13 * scale,
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12 * scale,
  backgroundColor: theme.buttonPrimary + "14",
},

mainContent: {
  flex: 1,
  marginRight: 10 * scale,
},

name: {
  fontSize: 18 * scale,
  fontWeight: "700",
  color: theme.text,
  marginBottom: 3 * scale,
},

muscles: {
  fontSize: 14 * scale,
  color: theme.textSecondary,
},

bottomRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 14 * scale,
  gap: 10 * scale,
},

statsContainer: {
  flexDirection: "row",
  alignItems: "center",
  gap: 7 * scale,
  flexShrink: 1,
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

date: {
  flexShrink: 1,
  fontSize: 12 * scale,
  color: theme.textSecondary,
  textAlign: "right",
},

initial: {
  fontSize: 17 * scale,
  fontWeight: "800",
  color: theme.buttonPrimary,
},
  });
