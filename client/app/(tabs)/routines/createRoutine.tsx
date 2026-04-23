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

export default function CreateRoutineScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { addRoutine, routines } = useRoutineContext();

  const [routine, setRoutine] = useState<Routine>({
    id: crypto.randomUUID(),
    name: `Routine #${routines.length + 1}`,
    exercises: [],
    notes: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [finishModalVisible, setFinishModalVisible] = useState(false);
  const [discardModalVisible, setDiscardModalVisible] = useState(false);

  const handleSubmit = useCallback(() => {
    addRoutine(routine);
    router.back();
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
  });
