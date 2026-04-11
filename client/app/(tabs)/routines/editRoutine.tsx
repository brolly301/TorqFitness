import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Routine } from "@/types/Global";
import ExerciseModal from "@/components/modals/exercises/ExerciseModal";
import WorkoutForm from "@/components/workout/WorkoutForm";
import * as crypto from "expo-crypto";
import { useRoutineContext } from "@/context/RoutineContext";
import DiscardModal from "@/components/modals/confirmation/DiscardModal";
import FinishModal from "@/components/modals/confirmation/FinishModal";
import AppWrapper from "@/components/ui/AppWrapper";
import Feather from "@expo/vector-icons/Feather";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function EditRoutineScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { routineId } = useLocalSearchParams();
  const resolvedRoutineId = Array.isArray(routineId) ? routineId[0] : routineId;

  const { routines, updateRoutine } = useRoutineContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [finishModalVisible, setFinishModalVisible] = useState(false);
  const [discardModalVisible, setDiscardModalVisible] = useState(false);

  const routineDetails = useMemo(() => {
    return routines.find((routine) => routine.id === resolvedRoutineId);
  }, [routines, resolvedRoutineId]);

  const [formData, setFormData] = useState<Routine>({
    id: "",
    name: "",
    exercises: [],
    notes: "",
  });

  useEffect(() => {
    if (!routineDetails) return;

    setFormData({
      ...routineDetails,
      exercises: routineDetails.exercises.map((exercise) => ({
        ...exercise,
        sets: exercise.sets.map((set) => ({ ...set })),
      })),
    });
  }, [routineDetails]);

  const handleSubmit = useCallback(() => {
    if (!formData) return;

    updateRoutine(formData);
    router.back();
  }, [formData, updateRoutine]);

  const handleAddExercise = (exerciseId: string) => {
    if (!formData) return;

    const newExercise = {
      id: crypto.randomUUID(),
      exerciseId,
      order: formData.exercises.length + 1,
      sets: [{ id: crypto.randomUUID(), order: 1, reps: 0, weight: null }],
      notes: "",
    };

    setFormData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        exercises: [...prev.exercises, newExercise],
      };
    });
  };

  if (!formData) {
    return (
      <AppWrapper>
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading routine...</Text>
        </View>
      </AppWrapper>
    );
  }

  return (
    <>
      <DiscardModal
        modalVisible={discardModalVisible}
        setModalVisible={setDiscardModalVisible}
        placeholder="discard your changes?"
        onConfirm={() => router.back()}
      />

      <FinishModal
        modalVisible={finishModalVisible}
        setModalVisible={setFinishModalVisible}
        onConfirm={handleSubmit}
        placeholder="editing this routine?"
      />

      <ExerciseModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleAddExercise={handleAddExercise}
      />

      <AppWrapper>
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable
              onPress={() => setDiscardModalVisible(true)}
              hitSlop={10}
              style={styles.headerIconButton}
            >
              <Feather name="arrow-left" color={theme.text} size={22 * scale} />
            </Pressable>

            <Pressable
              style={styles.saveButton}
              onPress={() => setFinishModalVisible(true)}
              hitSlop={10}
            >
              <Text style={styles.saveText}>Save</Text>
              <Feather
                name="check"
                color={theme.buttonPrimary}
                size={20 * scale}
              />
            </Pressable>
          </View>

          <View style={styles.formContainer}>
            <WorkoutForm
              setDraft={setFormData}
              mode="routine"
              draft={formData}
              setModalVisible={setModalVisible}
            />
          </View>
        </View>
      </AppWrapper>
    </>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16 * scale,
      paddingTop: 12 * scale,
      backgroundColor: theme.background,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16 * scale,
    },

    headerIconButton: {
      width: 40 * scale,
      height: 40 * scale,
      borderRadius: 12 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    saveButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10 * scale,
      paddingHorizontal: 14 * scale,
      borderRadius: 12 * scale,
      backgroundColor: theme.buttonPrimary + "15",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "30",
    },

    saveText: {
      fontSize: 16 * scale,
      fontWeight: "600",
      marginRight: 6 * scale,
      color: theme.buttonPrimary,
    },

    formContainer: {
      flex: 1,
    },

    loadingText: {
      fontSize: 16 * scale,
      color: theme.textSecondary,
    },
  });
