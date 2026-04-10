import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { capitalizeWords } from "@/utils/helpers";
import { router } from "expo-router";
import { Routine } from "@/types/Global";
import { useRoutineContext } from "@/context/RoutineContext";
import { useExerciseContext } from "@/context/ExerciseContext";
import DeleteModal from "../confirmation/DeleteModal";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = {
  routine: Routine;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RoutineDetails({ routine, setModalVisible }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { deleteRoutine } = useRoutineContext();
  const { exercises } = useExerciseContext();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const exerciseList = routine.exercises.map((rtEx) => {
    const details = exercises.find(
      (exercise) => exercise.id === rtEx.exerciseId,
    );
    return { ...rtEx, details };
  });

  const totalSets = routine.exercises.reduce(
    (total, ex) => total + ex.sets.length,
    0,
  );

  const handleEditRoutine = () => {
    router.navigate({
      pathname: "/(tabs)/routines/editRoutine",
      params: { routineId: routine.id },
    });
    setModalVisible(false);
  };

  const handleDeleteRoutine = () => {
    deleteRoutine(routine.id);
    setDeleteModalVisible(false);
    setModalVisible(false);
  };

  return (
    <>
      <DeleteModal
        modalVisible={deleteModalVisible}
        setModalVisible={setDeleteModalVisible}
        placeholder="routine"
        onConfirm={handleDeleteRoutine}
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => setModalVisible(false)}
            style={styles.iconButton}
          >
            <AntDesign name="close" size={20} color={theme.text} />
          </Pressable>

          <Text style={styles.name} numberOfLines={1}>
            {routine.name}
          </Text>

          <View style={styles.headerActions}>
            <Pressable
              style={[styles.secondaryAction, { marginRight: 8 * scale }]}
              // onPress={handleEditRoutine}
            >
              <MaterialIcons name="more-horiz" size={18} color={theme.text} />
            </Pressable>

            <Pressable style={styles.primaryAction} onPress={handleEditRoutine}>
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
              {!!routine.notes && (
                <Text style={styles.notes} numberOfLines={2}>
                  {routine.notes}
                </Text>
              )}

              <Text style={styles.metaText}>
                {routine.exercises.length} exercises • {totalSets} sets
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
              <View style={styles.routineCard}>
                <View style={styles.routineDetails}>
                  <View style={styles.nameButtonContainer}>
                    <View style={styles.exerciseTextContainer}>
                      <Text style={styles.exerciseName} numberOfLines={1}>
                        {capitalizeWords(item.details?.name ?? "")}
                      </Text>

                      <Text style={styles.exerciseMuscle} numberOfLines={1}>
                        {muscleText}
                      </Text>
                    </View>

                    <Entypo
                      name="chevron-right"
                      size={20}
                      color={theme.textSecondary}
                    />
                  </View>
                </View>

                <View style={styles.setCard}>
                  <Text style={styles.setDetails}>{item.sets.length} sets</Text>
                  <Text style={styles.setDetails}> • </Text>
                  <Text style={styles.setDetails}>Last: 40 × 8</Text>
                </View>
              </View>
            );
          }}
        />

        <Pressable
          style={styles.startButton}
          onPress={() => {
            setModalVisible(false);
            router.navigate({
              pathname: "/workout/createWorkout",
              params: { routineId: routine.id },
            });
          }}
        >
          <Text style={styles.startText}>Start Workout</Text>
        </Pressable>
      </View>
    </>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    header: {
      height: 44 * scale,
      justifyContent: "center",
      marginBottom: 8 * scale,
      position: "relative",
    },

    iconButton: {
      position: "absolute",
      left: 0,
      width: 36 * scale,
      height: 36 * scale,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
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
    },

    listContent: {
      paddingTop: 8 * scale,
      paddingBottom: 12 * scale,
    },

    overviewContainer: {
      marginBottom: 8 * scale,
    },

    notes: {
      fontSize: 15 * scale,
      color: theme.textSecondary,
      marginBottom: 6 * scale,
    },

    metaText: {
      fontSize: 15 * scale,
      color: theme.textSecondary,
    },

    routineCard: {
      marginTop: 10 * scale,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      overflow: "hidden",
    },

    routineDetails: {
      padding: 12 * scale,
    },

    nameButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    exerciseTextContainer: {
      flex: 1,
      marginRight: 12 * scale,
    },

    exerciseName: {
      fontSize: 17 * scale,
      fontWeight: "700",
      marginBottom: 2 * scale,
      color: theme.text,
    },

    exerciseMuscle: {
      fontSize: 14 * scale,
      fontWeight: "400",
      color: theme.textSecondary,
    },

    setCard: {
      paddingHorizontal: 12 * scale,
      paddingVertical: 10 * scale,
      flexDirection: "row",
      backgroundColor: theme.border,
    },

    setDetails: {
      fontSize: 14 * scale,
      color: theme.textSecondary,
    },

    secondaryAction: {
      paddingVertical: 7.5 * scale,
      paddingHorizontal: 10 * scale,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.border,
      borderRadius: 10,
    },

    primaryAction: {
      paddingVertical: 7.5 * scale,
      paddingHorizontal: 12 * scale,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.buttonPrimary,
      borderRadius: 10,
    },

    editText: {
      fontSize: 15 * scale,
      fontWeight: "600",
      color: theme.buttonPrimaryText,
    },

    startButton: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12,
      backgroundColor: theme.buttonPrimary,
      paddingVertical: 12 * scale,
      marginTop: 10 * scale,
    },

    startText: {
      fontSize: 15 * scale,
      color: theme.buttonPrimaryText,
      fontWeight: "700",
    },
  });
