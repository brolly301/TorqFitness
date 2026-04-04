import { StyleSheet, View } from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { useRoutineContext } from "@/context/RoutineContext";
import WorkoutForm from "@/components/workout/WorkoutForm";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import ExerciseModal from "@/components/modals/exercises/ExerciseModal";
import * as crypto from "expo-crypto";
import { Routine } from "@/types/Global";

export default function CreateRoutineScreen() {
  const { setRoutines } = useRoutineContext();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [routine, setRoutine] = useState<Routine>({
    id: crypto.randomUUID(),
    name: "",
    exercises: [],
    notes: "",
  });

  const navigation = useNavigation();

  const handleSubmit = useCallback(() => {
    if (!routine) return;

    setRoutines((prev) => [...prev, routine]);
    router.back();
  }, [routine, setRoutines]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <EvilIcons
            name="check"
            color={"black"}
            size={22}
            onPress={handleSubmit}
          />
        );
      },
    });
  }, [navigation, handleSubmit]);

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
      <ExerciseModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleAddExercise={handleAddExercise}
      />
      <WorkoutForm
        setDraft={setRoutine}
        draft={routine}
        setModalVisible={setModalVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({});
