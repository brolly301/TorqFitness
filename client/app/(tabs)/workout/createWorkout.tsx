import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import WorkoutForm from "@/components/workout/WorkoutForm";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { router, useLocalSearchParams } from "expo-router";
import ExerciseModal from "@/components/modals/exercises/ExerciseModal";
import * as crypto from "expo-crypto";
import { Workout } from "@/types/Global";
import FinishModal from "@/components/modals/confirmation/FinishModal";
import DiscardModal from "@/components/modals/confirmation/DiscardModal";
import AppWrapper from "@/components/ui/AppWrapper";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import Feather from "@expo/vector-icons/Feather";
import { useRoutineContext } from "@/context/RoutineContext";
import { toggleToast } from "@/utils/toggleToast";

export default function StartWorkoutScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { addWorkout, workouts } = useWorkoutContext();
  const { routines, markRoutineUsed } = useRoutineContext();
  const params = useLocalSearchParams<{ routineId?: string }>();
  const routineId = params.routineId;

  const [workout, setWorkout] = useState<Workout>({
    id: crypto.randomUUID(),
    routineId: routineId ?? null,
    name: `Workout #${workouts.length + 1}`,
    startedAt: null,
    completedAt: null,
    duration: 0,
    exercises: [],
    notes: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [finishModalVisible, setFinishModalVisible] = useState(false);
  const [discardModalVisible, setDiscardModalVisible] = useState(false);

  const routine = useMemo(() => {
    return routines.find((item) => item.id === routineId);
  }, [routines, routineId]);

  useEffect(() => {
    setWorkout((prev) => ({
      ...prev,
      startedAt: prev.startedAt ?? new Date().toISOString(),
    }));
  }, []);

  useEffect(() => {
    if (!routine) return;

    setWorkout((prev) => {
      if (prev.exercises.length > 0) return prev;

      return {
        ...prev,
        name: routine.name,
        exercises: routine.exercises.map((exercise) => ({
          ...exercise,
          id: crypto.randomUUID(),
          sets: exercise.sets.map((set) => ({
            ...set,
            id: crypto.randomUUID(),
          })),
        })),
      };
    });
  }, [routine]);

  const handleSubmit = useCallback(async () => {
    if (!workout.startedAt) return;

    try {
      setIsSaving(true);

      const completedAt = new Date().toISOString();
      const duration = Math.max(
        1,
        Math.floor(
          (new Date(completedAt).getTime() -
            new Date(workout.startedAt).getTime()) /
            1000,
        ),
      );

      const finalWorkout = {
        ...workout,
        completedAt,
        duration,
      };

      await addWorkout(finalWorkout);

      if (routineId) {
        markRoutineUsed(routineId, completedAt);
      }

      setFinishModalVisible(false);
      router.back();
    } catch (error) {
      toggleToast({
        type: "error",
        text1: "Workout not saved",
        text2:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }, [workout, addWorkout, routineId, markRoutineUsed]);

  const handleAddExercise = (exerciseId: string) => {
    const newExercise = {
      id: crypto.randomUUID(),
      exerciseId,
      order: workout.exercises.length + 1,
      sets: [{ id: crypto.randomUUID(), order: 1, reps: 0, weight: 0 }],
      notes: "",
    };

    setWorkout((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  const canFinish =
    workout.name.trim().length > 0 &&
    workout.exercises.length > 0 &&
    workout.exercises.every(
      (exercise) =>
        exercise.sets.length > 0 && exercise.sets.every((set) => set.reps > 0),
    );

  return (
    <>
      <DiscardModal
        modalVisible={discardModalVisible}
        setModalVisible={setDiscardModalVisible}
        placeholder="discard your current workout?"
        onConfirm={() => {
          setDiscardModalVisible(false);
          router.back();
        }}
      />

      <FinishModal
        modalVisible={finishModalVisible}
        setModalVisible={setFinishModalVisible}
        onConfirm={handleSubmit}
        placeholder="with this workout?"
        isConfirming={isSaving}
      />
      <ExerciseModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleAddExercise={handleAddExercise}
      />

      <AppWrapper>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={0}
        >
          <View style={styles.header}>
            <Pressable
              onPress={() => setDiscardModalVisible(true)}
              hitSlop={10}
              style={({ pressed }) => [
                styles.headerIconButton,
                pressed && styles.headerButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Discard workout and go back"
            >
              <Feather name="arrow-left" color={theme.text} size={22 * scale} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.finishButton,
                !canFinish && styles.finishButtonDisabled,
                pressed && canFinish && styles.headerButtonPressed,
              ]}
              onPress={() => setFinishModalVisible(true)}
              disabled={!canFinish}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Finish workout"
            >
              <Text
                style={[
                  styles.finishText,
                  !canFinish && styles.finishTextDisabled,
                ]}
              >
                Finish
              </Text>
            </Pressable>
          </View>

          <View style={styles.formContainer}>
            <WorkoutForm
              mode="workout"
              setDraft={setWorkout}
              draft={workout}
              setModalVisible={setModalVisible}
              showTimer
            />
          </View>
        </KeyboardAvoidingView>
      </AppWrapper>
    </>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 12 * scale,
      paddingHorizontal: 16 * scale,
      backgroundColor: theme.background,
    },

    header: {
      minHeight: 40 * scale,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      marginBottom: 16 * scale,
    },

    headerIconButton: {
      width: 40 * scale,
      height: 40 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12 * scale,
      zIndex: 1,
    },

    headerTitle: {
      position: "absolute",
      left: 80 * scale,
      right: 80 * scale,
      color: theme.text,
      fontSize: 17 * scale,
      fontWeight: "700",
      textAlign: "center",
    },

    finishButton: {
      minHeight: 40 * scale,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 14 * scale,
      backgroundColor: theme.buttonPrimary + "14",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "40",
      borderRadius: 12 * scale,
      zIndex: 1,
    },

    finishButtonDisabled: {
      backgroundColor: theme.buttonDisabled,
      borderColor: theme.border,
    },

    finishText: {
      color: theme.buttonPrimary,
      fontSize: 14 * scale,
      fontWeight: "700",
    },

    finishTextDisabled: {
      color: theme.buttonDisabledText,
    },

    headerButtonPressed: {
      opacity: 0.7,
    },

    formContainer: {
      flex: 1,
    },
  });
