import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { router } from "expo-router";
import { useRoutineContext } from "@/context/RoutineContext";
import WorkoutForm from "@/components/workout/WorkoutForm";
import ExerciseModal from "@/components/modals/exercises/ExerciseModal";
import * as crypto from "expo-crypto";
import { Routine } from "@/types/Global";
import FinishModal from "@/components/modals/confirmation/FinishModal";
import DiscardModal from "@/components/modals/confirmation/DiscardModal";
import { useAppTheme } from "@/hooks/useAppTheme";
import AppWrapper from "@/components/ui/AppWrapper";
import Feather from "@expo/vector-icons/Feather";
import { Theme } from "@/types/Theme";
import { toggleToast } from "@/utils/toggleToast";

export default function CreateRoutineScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { addRoutine, routines } = useRoutineContext();

  const [routine, setRoutine] = useState<Routine>({
    id: crypto.randomUUID(),
    name: `Routine #${routines.length + 1}`,
    exercises: [],
    notes: "",
    lastUsedAt: null,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [finishModalVisible, setFinishModalVisible] = useState(false);
  const [discardModalVisible, setDiscardModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = useCallback(async () => {
    try {
      setIsSaving(true);

      await addRoutine(routine);

      setFinishModalVisible(false);
      router.back();
    } catch (error) {
      toggleToast({
        type: "error",
        text1: "Routine not saved",
        text2:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }, [routine, addRoutine]);

  const handleAddExercise = (exerciseId: string) => {
    const newExercise = {
      id: crypto.randomUUID(),
      exerciseId,
      order: routine.exercises.length + 1,
      sets: [{ id: crypto.randomUUID(), order: 1, reps: 0, weight: 0 }],
      notes: "",
    };

    setRoutine((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  const canSave =
    routine.name.trim().length > 0 &&
    routine.exercises.length > 0 &&
    routine.exercises.every((exercise) => exercise.sets.length > 0);

  return (
    <>
      <DiscardModal
        modalVisible={discardModalVisible}
        setModalVisible={setDiscardModalVisible}
        placeholder="discard your new routine?"
        onConfirm={() => router.back()}
      />

      <FinishModal
        modalVisible={finishModalVisible}
        setModalVisible={setFinishModalVisible}
        onConfirm={handleSubmit}
        isConfirming={isSaving}
        placeholder="with this routine?"
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
    accessibilityLabel="Discard routine and go back"
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
    accessibilityLabel="Save routine"
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
              mode="routine"
              setDraft={setRoutine}
              draft={routine}
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
  });