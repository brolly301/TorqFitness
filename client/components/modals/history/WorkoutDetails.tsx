import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Workout } from "@/types/Global";
import { useWorkoutContext } from "@/context/WorkoutContext";
import {
  capitalizeWords,
  formatDate,
  formatTime,
  formatWeight,
} from "@/utils/helpers";
import { useExerciseContext } from "@/context/ExerciseContext";
import DeleteModal from "../confirmation/DeleteModal";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSettingsContext } from "@/context/SettingsContext";

type Props = {
  workout: Workout;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  returnTo: "/(tabs)/workout" | "/(tabs)/history";
};

export default function WorkoutDetails({
  workout,
  setModalVisible,
  returnTo,
}: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { deleteWorkout } = useWorkoutContext();
  const { exercises } = useExerciseContext();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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

  const getPreviousSetText = (reps?: number, weight?: number | null) => {
    if (!reps && !weight) return "—";

    return `${formatWeight(weight ?? 0, weightUnit)} × ${reps ?? 0}`;
  };

  const workoutDate = workout.startedAt ? formatDate(workout.startedAt) : "—";
  const workoutDuration = formatTime(workout.duration);

  const handleDeleteWorkout = () => {
    deleteWorkout(workout.id);
    setDeleteModalVisible(false);
    setModalVisible(false);
  };

  const handleEditWorkout = () => {
    setModalVisible(false);

    router.push({
      pathname: "/(tabs)/history/editWorkout",
      params: {
        workoutId: workout.id,
        returnTo,
      },
    });
  };

  return (
    <>
      <DeleteModal
        modalVisible={deleteModalVisible}
        setModalVisible={setDeleteModalVisible}
        placeholder="workout"
        onConfirm={handleDeleteWorkout}
      />

      <View style={styles.container}>
       <View style={styles.header}>
  <View style={styles.headerText}>
    <Text style={styles.name} numberOfLines={2}>
      {workout.name}
    </Text>

    <Text style={styles.headerMeta}>
      {workoutDate} • {workoutDuration} •{" "}
      {workout.exercises.length}{" "}
      {workout.exercises.length === 1 ? "exercise" : "exercises"} •{" "}
      {totalSets} {totalSets === 1 ? "set" : "sets"}
    </Text>
  </View>

  <Pressable
    onPress={() => setModalVisible(false)}
    style={styles.iconButton}
    hitSlop={8}
  >
    <AntDesign name="close" size={20 * scale} color={theme.text} />
  </Pressable>
</View>

<View style={styles.actionRow}>
  <Pressable style={styles.editAction} onPress={handleEditWorkout}>
    <MaterialIcons
      name="edit"
      size={17 * scale}
      color={theme.buttonPrimary}
    />
    <Text style={styles.editText}>Edit Workout</Text>
  </Pressable>

  <Pressable
    style={styles.deleteAction}
    onPress={() => setDeleteModalVisible(true)}
    accessibilityRole="button"
    accessibilityLabel="Delete workout"
  >
    <MaterialIcons
      name="delete-outline"
      size={19 * scale}
      color={theme.error}
    />
  </Pressable>
</View>
      

        <FlatList
          data={exerciseList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
   ListHeaderComponent={
  workout.notes ? (
    <View style={styles.overviewContainer}>
      <Text style={styles.notes} numberOfLines={3}>
        {workout.notes}
      </Text>
    </View>
  ) : null
}
          ListHeaderComponent={
  workout.notes ? (
    <View style={styles.overviewContainer}>
      <Text style={styles.notes} numberOfLines={3}>
        {workout.notes}
      </Text>
    </View>
  ) : null

          }
          renderItem={({ item }) => {
            const primary = capitalizeWords(
              item.details?.primaryMuscles?.[0] ?? "",
            );
            const secondary = capitalizeWords(
              item.details?.secondaryMuscles?.[0] ?? "",
            );

            const muscleText =
              primary && secondary
                ? `${primary} & ${secondary}`
                : primary || secondary || "Exercise";

            return (
              <View style={styles.workoutCard}>
                <View style={styles.workoutDetails}>
                  <Text style={styles.exerciseName} numberOfLines={1}>
                    {capitalizeWords(item.details?.name ?? "Exercise")}
                  </Text>

                  <Text style={styles.exerciseMuscle} numberOfLines={1}>
                    {muscleText}
                  </Text>
                </View>

                <View style={styles.hr} />

                <View style={styles.columnHeaderRow}>
                  <Text style={styles.columnHeaderLeft}>Set</Text>
                  <Text style={styles.columnHeaderRight}>Result</Text>
                </View>

                {item.sets.map((set, index) => {
                  const currentText = `${formatWeight(set.weight ?? 0, weightUnit)} × ${set.reps ?? 0}`;

                  return (
                    <View
                      key={set.id ?? `${item.id}-${index}`}
                      style={[
                        styles.setCard,
                        index !== item.sets.length - 1 && styles.setCardBorder,
                      ]}
                    >
                      <View style={styles.setNumber}>
                        <Text style={styles.setNumberText}>{set.order}</Text>
                      </View>

                      <Text style={styles.currentSetText}>{currentText}</Text>
                    </View>
                  );
                })}
              </View>
            );
          }}
        />
        {exerciseList.length < 1 ? (
          <View style={styles.placeholderContainer}>
            <MaterialCommunityIcons
              name="dumbbell"
              color={theme.text + "CC"}
              size={17}
            />
            <Text style={styles.placeholderText}>No exercises added yet</Text>
          </View>
        ) : null}
      </View>
    </>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flexShrink: 1,
    },

    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 14 * scale,
    },

    headerText: {
      flex: 1,
      marginRight: 14 * scale,
    },

    name: {
      fontSize: 24 * scale,
      lineHeight: 29 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 5 * scale,
    },

    headerMeta: {
      fontSize: 13 * scale,
      lineHeight: 18 * scale,
      color: theme.textSecondary,
    },

    iconButton: {
      width: 36 * scale,
      height: 36 * scale,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    actionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8 * scale,
      marginBottom: 12 * scale,
    },

    editAction: {
      flex: 1,
      minHeight: 40 * scale,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7 * scale,
      borderRadius: 11 * scale,
      backgroundColor: theme.buttonPrimary + "12",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "35",
    },

    editText: {
      fontSize: 14 * scale,
      fontWeight: "600",
      color: theme.buttonPrimary,
    },

    deleteAction: {
      width: 42 * scale,
      height: 40 * scale,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 11 * scale,
      backgroundColor: theme.error + "12",
      borderWidth: 1,
      borderColor: theme.error + "30",
    },

    listContent: {
      paddingTop: 4 * scale,
      paddingBottom: 12 * scale,
    },

    overviewContainer: {
      marginBottom: 8 * scale,
    },

    notes: {
      fontSize: 14 * scale,
      lineHeight: 20 * scale,
      color: theme.textSecondary,
    },

    workoutCard: {
      marginTop: 10 * scale,
      overflow: "hidden",
      borderRadius: 14 * scale,
      backgroundColor: theme.cardSurface,
      borderWidth: 1,
      borderColor: theme.border,
    },

    workoutDetails: {
      paddingHorizontal: 14 * scale,
      paddingTop: 14 * scale,
      paddingBottom: 12 * scale,
    },

    exerciseName: {
      fontSize: 17 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 2 * scale,
    },

    exerciseMuscle: {
      fontSize: 14 * scale,
      color: theme.textSecondary,
    },

    hr: {
      width: "100%",
      height: 1,
      backgroundColor: theme.border,
    },

    columnHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14 * scale,
      paddingTop: 10 * scale,
      paddingBottom: 6 * scale,
      backgroundColor: theme.headerSurface,
    },

    columnHeaderLeft: {
      width: 42 * scale,
      fontSize: 12 * scale,
      fontWeight: "600",
      color: theme.textSecondary,
    },

    columnHeaderRight: {
      flex: 1,
      fontSize: 12 * scale,
      fontWeight: "600",
      color: theme.textSecondary,
      textAlign: "right",
    },

    setCard: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14 * scale,
      paddingVertical: 9 * scale,
      backgroundColor: theme.rowSurface,
    },

    setCardBorder: {
      borderBottomWidth: 1,
      borderBottomColor: theme.rowDivider,
    },

    setNumber: {
      width: 30 * scale,
      height: 30 * scale,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12 * scale,
      borderRadius: 9 * scale,
      backgroundColor: theme.buttonPrimary + "12",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "30",
    },

    setNumberText: {
      fontSize: 13 * scale,
      fontWeight: "700",
      color: theme.buttonPrimary,
    },

    currentSetText: {
      flex: 1,
      fontSize: 15 * scale,
      fontWeight: "600",
      color: theme.text,
      textAlign: "right",
    },

    placeholderContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12 * scale,
    },

    placeholderText: {
      fontSize: 14 * scale,
      color: theme.textSecondary,
      marginLeft: 10 * scale,
    },
  });