import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { router, useNavigation } from "expo-router";
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

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [finishModalVisible, setFinishModalVisible] = useState<boolean>(false);
  const [discardModalVisible, setDiscardModalVisible] =
    useState<boolean>(false);

  const handleSubmit = useCallback(() => {
    if (!routine) return;

    addRoutine(routine);
    router.back();
  }, [routine, addRoutine]);

  const handleAddExercise = (exerciseId: string) => {
    const newExercise = {
      id: crypto.randomUUID(),
      exerciseId,
      order: 1,
      sets: [{ id: crypto.randomUUID(), order: 1, reps: 0, weight: null }],
      notes: "",
    };

    setRoutine((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          ...newExercise,
          order: prev.exercises.length + 1,
        },
      ],
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
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable
              onPress={() => setDiscardModalVisible(true)}
              hitSlop={10}
              style={styles.headerIconContainer}
            >
              <Feather name="arrow-left" color={"black"} size={24} />
            </Pressable>
            <Pressable
              style={styles.headerIconContainer}
              onPress={() => setFinishModalVisible(true)}
              hitSlop={10}
            >
              <Text style={[styles.headerText, { color: theme.buttonPrimary }]}>
                Save
              </Text>
              <Feather name="check" color={theme.buttonPrimary} size={24} />
            </Pressable>
          </View>
          <WorkoutForm
            mode="routine"
            setDraft={setRoutine}
            draft={routine}
            setModalVisible={setModalVisible}
          />
        </View>
      </AppWrapper>
    </>
  );
}
const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: { padding: 16 * scale, backgroundColor: theme.background },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      // marginTop: 40,
      marginBottom: 30,
    },
    headerText: {
      fontSize: 20,
      fontWeight: "600",
      marginRight: 4,
    },
    headerIconContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
