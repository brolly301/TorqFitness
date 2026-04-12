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

export default function StartWorkoutScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { addWorkout, workouts } = useWorkoutContext();
  const { routines } = useRoutineContext();
  const { routineId } = useLocalSearchParams();

  const [workout, setWorkout] = useState<Workout>({
    id: crypto.randomUUID(),
    name: `Workout #${workouts.length + 1}`,
    startedAt: null,
    completedAt: null,
    duration: 0,
    exercises: [],
    notes: "",
  });

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

  const handleSubmit = useCallback(() => {
    if (!workout.startedAt) return;

    const completedAt = new Date().toISOString();
    const duration = Math.floor(
      (new Date(completedAt).getTime() -
        new Date(workout.startedAt).getTime()) /
        1000,
    );

    const finalWorkout = {
      ...workout,
      completedAt,
      duration,
    };

    addWorkout(finalWorkout);
    router.back();
  }, [workout, addWorkout]);

  const handleAddExercise = (exerciseId: string) => {
    const newExercise = {
      id: crypto.randomUUID(),
      exerciseId,
      order: workout.exercises.length + 1,
      sets: [{ id: crypto.randomUUID(), order: 1, reps: 0, weight: null }],
      notes: "",
    };

    setWorkout((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  return (
    <>
      <DiscardModal
        modalVisible={discardModalVisible}
        setModalVisible={setDiscardModalVisible}
        placeholder="discard your current workout?"
        onConfirm={() => router.back()}
      />

      <FinishModal
        modalVisible={finishModalVisible}
        setModalVisible={setFinishModalVisible}
        onConfirm={handleSubmit}
        placeholder="with this workout?"
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
              style={styles.headerIconButton}
            >
              <Feather name="arrow-left" color={theme.text} size={22 * scale} />
            </Pressable>

            <Pressable
              style={styles.finishButton}
              onPress={() => setFinishModalVisible(true)}
              hitSlop={10}
            >
              <Text style={styles.finishText}>Finish</Text>
              <Feather
                name="check"
                color={theme.buttonPrimary}
                size={20 * scale}
              />
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

    finishButton: {
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

    finishText: {
      fontSize: 16 * scale,
      fontWeight: "600",
      marginRight: 6 * scale,
      color: theme.buttonPrimary,
    },

    formContainer: {
      flex: 1,
    },
  });
