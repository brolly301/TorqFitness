import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Workout } from "@/types/Global";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { capitalizeWords, formatDate, formatTime } from "@/utils/helpers";
import { useExerciseContext } from "@/context/ExerciseContext";
import DeleteModal from "../confirmation/DeleteModal";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";

type Props = {
  workout: Workout;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function WorkoutDetails({ workout, setModalVisible }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { deleteWorkout } = useWorkoutContext();
  const { exercises } = useExerciseContext();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const exerciseList = useMemo(() => {
    return workout.exercises.map((we) => {
      const details = exercises.find((ex) => ex.id === we.exerciseId);
      return { ...we, details };
    });
  }, [workout.exercises, exercises]);

  const totalSets = useMemo(() => {
    return workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  }, [workout.exercises]);

  const getPreviousSetText = (reps?: number, weight?: number) => {
    if (!reps && !weight) return "—";
    return `${weight ?? 0} kg × ${reps ?? 0}`;
  };

  const workoutDate = workout.startedAt ? formatDate(workout.startedAt) : "—";
  const workoutDuration = formatTime(workout.duration);

  const handleDeleteWorkout = () => {
    deleteWorkout(workout.id);
    setDeleteModalVisible(false);
    setModalVisible(false);
  };

  const handleEditWorkout = () => {
    router.push({
      pathname: "/(tabs)/history/editWorkout",
      params: { workoutId: workout.id },
    });
    setModalVisible(false);
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
          <Pressable
            onPress={() => setModalVisible(false)}
            style={styles.iconButton}
          >
            <AntDesign name="close" size={20 * scale} color={theme.text} />
          </Pressable>

          <Text style={styles.name} numberOfLines={1}>
            {workout.name}
          </Text>

          <View style={styles.headerActions}>
            <Pressable
              style={[styles.secondaryAction, { marginRight: 8 * scale }]}
              onPress={() => setDeleteModalVisible(true)}
            >
              <MaterialIcons
                name="delete-outline"
                size={18 * scale}
                color={theme.text}
              />
            </Pressable>

            <Pressable style={styles.primaryAction} onPress={handleEditWorkout}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>
        </View>

        <FlatList
          data={exerciseList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.overviewContainer}>
              {!!workout.notes && (
                <Text style={styles.notes} numberOfLines={2}>
                  {workout.notes}
                </Text>
              )}

              <Text style={styles.metaPrimary}>{workoutDate}</Text>
              <Text style={styles.metaText}>
                {workoutDuration} • {workout.exercises.length} exercises •{" "}
                {totalSets} sets
              </Text>
            </View>
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
                  <Text style={styles.columnHeaderRight}>Previous</Text>
                </View>

                {item.sets.map((set, index) => {
                  const currentText = `${set.weight ?? 0} kg × ${set.reps ?? 0}`;
                  const previousText = getPreviousSetText(8, 40);

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

                      <Text style={styles.previousSetText}>{previousText}</Text>
                    </View>
                  );
                })}
              </View>
            );
          }}
        />
      </View>
    </>
  );
}

export const makeStyles = (theme: Theme, scale: number) => {
  const cardSurface = "#F2F2F5";
  const rowSurface = "#FAFAFB";
  const headerSurface = "#E7E6EB";
  const rowDivider = "#ECECF0";

  return StyleSheet.create({
    container: {
      flex: 1,
    },

    header: {
      height: 44 * scale,
      justifyContent: "center",
      marginBottom: 10 * scale,
      position: "relative",
    },

    listContent: {
      paddingTop: 8 * scale,
      paddingBottom: 12 * scale,
    },

    overviewContainer: {
      marginBottom: 6 * scale,
    },

    notes: {
      fontSize: 15 * scale,
      color: theme.textSecondary,
      marginBottom: 6 * scale,
    },

    metaPrimary: {
      fontSize: 16 * scale,
      color: theme.textSecondary,
      marginBottom: 2 * scale,
      fontWeight: "600",
    },

    metaText: {
      fontSize: 15 * scale,
      color: theme.textSecondary,
    },

    workoutCard: {
      marginTop: 10 * scale,
      borderRadius: 14 * scale,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: cardSurface,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },

    workoutDetails: {
      paddingHorizontal: 14 * scale,
      paddingTop: 14 * scale,
      paddingBottom: 12 * scale,
    },

    exerciseName: {
      fontSize: 17 * scale,
      fontWeight: "700",
      marginBottom: 2 * scale,
      color: theme.text,
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
      backgroundColor: headerSurface,
    },

    columnHeaderLeft: {
      width: 46 * scale,
      fontSize: 13 * scale,
      color: theme.textSecondary,
    },

    columnHeaderRight: {
      flex: 1,
      textAlign: "right",
      fontSize: 13 * scale,
      color: theme.textSecondary,
    },

    setCard: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14 * scale,
      paddingVertical: 10 * scale,
      backgroundColor: rowSurface,
    },

    setCardBorder: {
      borderBottomWidth: 1,
      borderBottomColor: rowDivider,
    },

    setNumber: {
      width: 34 * scale,
      height: 34 * scale,
      borderRadius: 10 * scale,
      backgroundColor: theme.buttonPrimary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12 * scale,
    },

    setNumberText: {
      color: theme.buttonPrimaryText,
      fontSize: 15 * scale,
      fontWeight: "700",
    },

    currentSetText: {
      flex: 1,
      fontSize: 16 * scale,
      fontWeight: "600",
      color: theme.text,
    },

    previousSetText: {
      width: 110 * scale,
      textAlign: "right",
      fontSize: 15 * scale,
      color: theme.textSecondary,
    },

    iconButton: {
      position: "absolute",
      left: 0,
      width: 36 * scale,
      height: 36 * scale,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    headerActions: {
      position: "absolute",
      right: 0,
      flexDirection: "row",
      alignItems: "center",
    },

    name: {
      position: "absolute",
      left: 60 * scale,
      right: 60 * scale,
      fontSize: 22 * scale,
      fontWeight: "700",
      textAlign: "center",
      color: theme.text,
    },

    secondaryAction: {
      paddingVertical: 7.5 * scale,
      paddingHorizontal: 10 * scale,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.border,
      borderRadius: 10 * scale,
    },

    primaryAction: {
      paddingVertical: 7.5 * scale,
      paddingHorizontal: 12 * scale,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.buttonPrimary,
      borderRadius: 10 * scale,
    },

    editText: {
      fontSize: 15 * scale,
      fontWeight: "600",
      color: theme.buttonPrimaryText,
    },
  });
};
