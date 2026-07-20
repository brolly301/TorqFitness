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
import { toggleToast } from "@/utils/toggleToast";

export default function EditWorkoutScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const params = useLocalSearchParams<{
    workoutId?: string;
    returnTo?: string;
  }>();

  const resolvedWorkoutId = Array.isArray(params.workoutId)
    ? params.workoutId[0]
    : params.workoutId;

  const returnTo =
    params.returnTo === "/(tabs)/workout"
      ? "/(tabs)/workout"
      : "/(tabs)/history";

  const { workouts, updateWorkout } = useWorkoutContext();
  const [isSaving, setIsSaving] = useState(false);
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

  const exitEditScreen = () => {
    router.dismissTo("/(tabs)/history");

    if (returnTo === "/(tabs)/workout") {
      requestAnimationFrame(() => {
        router.navigate("/(tabs)/workout");
      });
    }
  };

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

  const handleSubmit = useCallback(async () => {
    try {
      setIsSaving(true);

      await updateWorkout(formData);

      setFinishModalVisible(false);
      exitEditScreen();
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
  }, [formData, updateWorkout, returnTo]);

  const handleAddExercise = (exerciseId: string) => {
    if (!formData) return;

    const newExercise = {
      id: crypto.randomUUID(),
      exerciseId,
      order: formData.exercises.length + 1,
      sets: [{ id: crypto.randomUUID(), order: 1, reps: 0, weight: 0 }],
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

  const canSave =
    formData.name.trim().length > 0 &&
    formData.exercises.length > 0 &&
    formData.exercises.every(
      (exercise) =>
        exercise.sets.length > 0 && exercise.sets.every((set) => set.reps > 0),
    );

  return (
    <>
      <DiscardModal
        modalVisible={discardModalVisible}
        setModalVisible={setDiscardModalVisible}
        placeholder="discard your changes?"
        onConfirm={exitEditScreen}
      />

      <FinishModal
        modalVisible={finishModalVisible}
        setModalVisible={setFinishModalVisible}
        onConfirm={handleSubmit}
        placeholder="editing this workout?"
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
    accessibilityLabel="Discard changes and go back"
  >
    <Feather
      name="arrow-left"
      color={theme.text}
      size={22 * scale}
    />
  </Pressable>

  <Pressable
    style={({ pressed }) => [
      styles.saveButton,
      !canSave && styles.saveButtonDisabled,
      pressed && canSave && styles.headerButtonPressed,
    ]}
    onPress={() => setFinishModalVisible(true)}
    disabled={!canSave}
    hitSlop={10}
    accessibilityRole="button"
    accessibilityLabel="Save workout changes"
  >
    <Text
      style={[
        styles.saveText,
        !canSave && styles.saveTextDisabled,
      ]}
    >
      Save
    </Text>
  </Pressable>
</View>

          <View style={styles.formContainer}>
            <WorkoutForm
              setDraft={setFormData}
              mode="workout"
              draft={formData}
              setModalVisible={setModalVisible}
              excludeWorkoutId={formData.id}
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
    },

    saveButton: {
      minHeight: 40 * scale,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 14 * scale,
      backgroundColor: theme.buttonPrimary + "14",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "40",
      borderRadius: 12 * scale,
    },

    saveButtonDisabled: {
      backgroundColor: theme.buttonDisabled,
      borderColor: theme.border,
    },

    saveText: {
      color: theme.buttonPrimary,
      fontSize: 14 * scale,
      fontWeight: "700",
    },

    saveTextDisabled: {
      color: theme.buttonDisabledText,
    },

    headerButtonPressed: {
      opacity: 0.7,
    },

    formContainer: {
      flex: 1,
    },

    loadingText: {
      color: theme.textSecondary,
      fontSize: 16 * scale,
    },
  });