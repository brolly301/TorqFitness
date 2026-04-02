import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { Routine, Workout } from "@/types/Global";
import ExerciseModal from "@/components/modals/exercises/ExerciseModal";
import WorkoutForm from "@/components/workout/WorkoutForm";
import * as crypto from "expo-crypto";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useRoutineContext } from "@/context/RoutineContext";

export default function EditRoutineScreen() {
  const { routineId } = useLocalSearchParams();
  const { routines, setRoutines } = useRoutineContext();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const routineDetails = routines.find((wk) => wk.id === routineId);

  const navigation = useNavigation();

  if (!routineDetails) return;

  const [formData, setFormData] = useState<Routine>(routineDetails);

  const handleSubmit = useCallback(() => {
    setRoutines((prev) =>
      prev.map((routine) => (routine.id === formData.id ? formData : routine)),
    );
    router.back();
  }, [formData, setRoutines]);

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

    setFormData((prev) => ({
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
        setDraft={setFormData}
        draft={formData}
        setModalVisible={setModalVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({});
