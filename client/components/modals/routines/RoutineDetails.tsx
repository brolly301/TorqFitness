import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { capitalizeWords, formatWeight } from "@/utils/helpers";
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
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSettingsContext } from "@/context/SettingsContext";

type Props = {
  routine: Routine;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  returnTo: "/(tabs)/workout" | "/(tabs)/routines";
};

export default function RoutineDetails({
  routine,
  setModalVisible,
  returnTo,
}: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { deleteRoutine } = useRoutineContext();
  const { exercises } = useExerciseContext();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(
  null,
);

  const { settings } = useSettingsContext();
  const weightUnit = settings?.weightLabel ?? "kg";

  const exerciseList = useMemo(() => {
    return routine.exercises.map((rtEx) => {
      const details = exercises.find(
        (exercise) => exercise.id === rtEx.exerciseId,
      );
      return { ...rtEx, details };
    });
  }, [routine.exercises, exercises]);

  const totalSets = useMemo(() => {
    return routine.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  }, [routine.exercises]);

  const handleEditRoutine = () => {
    setModalVisible(false);

    router.push({
      pathname: "/(tabs)/routines/editRoutine",
      params: {
        routineId: routine.id,
        returnTo,
      },
    });
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
  <View style={styles.headerText}>
    <Text style={styles.name} numberOfLines={2}>
      {routine.name}
    </Text>

    <Text style={styles.headerMeta}>
      {routine.exercises.length}{" "}
      {routine.exercises.length === 1 ? "exercise" : "exercises"}
      {" • "}
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
  <Pressable style={styles.editAction} onPress={handleEditRoutine}>
    <MaterialIcons
      name="edit"
      size={17 * scale}
      color={theme.buttonPrimary}
    />
    <Text style={styles.editText}>Edit Routine</Text>
  </Pressable>

  <Pressable
    style={styles.deleteAction}
    onPress={() => setDeleteModalVisible(true)}
    accessibilityRole="button"
    accessibilityLabel="Delete routine"
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

  const isExpanded = expandedExerciseId === item.id;
  const visibleSets = isExpanded ? item.sets : item.sets.slice(0, 2);
  const remainingSets = item.sets.length - visibleSets.length;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.routineCard,
        pressed && styles.routineCardPressed,
      ]}
      onPress={() =>
        setExpandedExerciseId((currentId) =>
          currentId === item.id ? null : item.id,
        )
      }
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
    >
      <View style={styles.routineDetails}>
        <View style={styles.nameButtonContainer}>
          <View style={styles.exerciseTextContainer}>
            <Text style={styles.exerciseName} numberOfLines={1}>
              {capitalizeWords(item.details?.name ?? "Exercise")}
            </Text>

            <Text style={styles.exerciseMuscle} numberOfLines={1}>
              {muscleText}
            </Text>
          </View>

          <Entypo
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20 * scale}
            color={theme.textSecondary}
          />
        </View>
      </View>

      <View style={styles.setPreview}>
        {visibleSets.map((set, index) => {
          const setText = set.weight
            ? `${formatWeight(set.weight, weightUnit)} × ${set.reps}`
            : `${set.reps} reps`;

          return (
            <View key={set.id} style={styles.setPill}>
              <Text style={styles.setText}>
                {index + 1}. {setText}
              </Text>
            </View>
          );
        })}

        {remainingSets > 0 ? (
          <View style={styles.morePill}>
            <Text style={styles.moreText}>+{remainingSets} more</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}}
          ListFooterComponent={<View style={styles.footerSpacer} />}
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

       <Pressable
  style={({ pressed }) => [
    styles.startButton,
    pressed && styles.startButtonPressed,
  ]}
  onPress={() => {
    setModalVisible(false);

    router.push({
      pathname: "/workout/createWorkout",
      params: { routineId: routine.id },
    });
  }}
>
  <Entypo
    name="controller-play"
    size={17 * scale}
    color={theme.buttonPrimary}
  />
  <Text style={styles.startText}>Start Workout</Text>
</Pressable>
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
      fontSize: 14 * scale,
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
      marginBottom: 12 * scale,
      gap: 8 * scale,
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
    },

    overviewContainer: {
      marginBottom: 8 * scale,
    },

    notes: {
      fontSize: 14 * scale,
      lineHeight: 20 * scale,
      color: theme.textSecondary,
    },

    routineCard: {
      marginTop: 10 * scale,
      borderRadius: 14 * scale,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      overflow: "hidden",
    },

    routineCardPressed: {
      opacity: 0.8,
    },

    routineDetails: {
      paddingHorizontal: 14 * scale,
      paddingTop: 13 * scale,
      paddingBottom: 11 * scale,
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
      color: theme.textSecondary,
    },

    setPreview: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 7 * scale,
      paddingHorizontal: 14 * scale,
      paddingBottom: 13 * scale,
    },

    setPill: {
      paddingHorizontal: 9 * scale,
      paddingVertical: 5 * scale,
      borderRadius: 999,
      backgroundColor: theme.buttonSecondary,
      borderWidth: 1,
      borderColor: theme.border,
    },

    setText: {
      fontSize: 12 * scale,
      fontWeight: "600",
      color: theme.textSecondary,
    },

    morePill: {
      paddingHorizontal: 9 * scale,
      paddingVertical: 5 * scale,
      borderRadius: 999,
      backgroundColor: theme.buttonPrimary + "12",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "25",
    },

    moreText: {
      fontSize: 12 * scale,
      fontWeight: "600",
      color: theme.buttonPrimary,
    },

    footerSpacer: {
      height: 8 * scale,
    },

    placeholderContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12 * scale,
    },

    placeholderText: {
      color: theme.textSecondary,
      fontSize: 14 * scale,
      marginLeft: 10 * scale,
    },

    startButton: {
      minHeight: 46 * scale,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8 * scale,
      borderRadius: 13 * scale,
      marginTop: 15 * scale,
      backgroundColor: theme.buttonPrimary + "14",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "40",
    },

    startButtonPressed: {
      backgroundColor: theme.buttonPrimary + "24",
    },

    startText: {
      fontSize: 15 * scale,
      fontWeight: "700",
      color: theme.buttonPrimary,
    },
  });