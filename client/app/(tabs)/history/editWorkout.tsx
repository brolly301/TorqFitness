import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { Workout } from "@/types/Global";
import ExerciseModal from "@/components/modals/exercises/ExerciseModal";
import WorkoutForm from "@/components/workout/WorkoutForm";
import * as crypto from "expo-crypto";
import DiscardModal from "@/components/modals/confirmation/DiscardModal";
import FinishModal from "@/components/modals/confirmation/FinishModal";
import { Theme } from "@/types/Theme";
import AppWrapper from "@/components/ui/AppWrapper";
import Feather from "@expo/vector-icons/Feather";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function EditWorkoutScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { workoutId } = useLocalSearchParams();
  const resolvedWorkoutId = Array.isArray(workoutId) ? workoutId[0] : workoutId;

  const { workouts, updateWorkout } = useWorkoutContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [finishModalVisible, setFinishModalVisible] = useState(false);
  const [discardModalVisible, setDiscardModalVisible] = useState(false);

  const workoutDetails = useMemo(() => {
    return workouts.find((workout) => workout.id === resolvedWorkoutId);
  }, [workouts, resolvedWorkoutId]);

  const [formData, setFormData] = useState<Workout>({
    id: "",
    name: "",
    startedAt: null,
    completedAt: null,
    duration: 0,
    exercises: [],
    notes: "",
  });

  useEffect(() => {
    if (!workoutDetails) return;

    setFormData({
      ...workoutDetails,
      exercises: workoutDetails.exercises.map((exercise) => ({
        ...exercise,
        sets: exercise.sets.map((set) => ({ ...set })),
      })),
    });
  }, [workoutDetails]);

  const handleSubmit = useCallback(() => {
    if (!formData) return;

    updateWorkout(formData);
    router.back();
  }, [formData, updateWorkout]);

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

  if (!workoutDetails) {
    return (
      <AppWrapper>
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading workout...</Text>
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
        placeholder="editing this workout?"
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
              mode="workout"
              draft={formData}
              setModalVisible={setModalVisible}
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
