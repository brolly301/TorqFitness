import { StyleSheet, Text, View } from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import WorkoutForm from "@/components/workout/WorkoutForm";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { router, useNavigation } from "expo-router";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import ExerciseModal from "@/components/modals/exercises/ExerciseModal";
import * as crypto from "expo-crypto";
import { Workout } from "@/types/Global";

export default function StartWorkoutScreen() {
  const { setWorkouts } = useWorkoutContext();

  const [workout, setWorkout] = useState<Workout>({
    id: crypto.randomUUID(),
    name: "",
    startedAt: null,
    completedAt: null,
    duration: 0,
    exercises: [],
    notes: "",
  });

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const navigation = useNavigation();
  useEffect(() => {
    setWorkout((prev) => ({
      ...prev,
      startedAt: new Date().toISOString(),
    }));
  }, []);

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

    setWorkouts((prev) => [...prev, finalWorkout]);
    router.back();
  }, [workout, setWorkouts]);

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

    setWorkout((prev) => ({
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
        setDraft={setWorkout}
        draft={workout}
        setModalVisible={setModalVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({});
