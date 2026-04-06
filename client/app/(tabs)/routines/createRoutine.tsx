import { StyleSheet } from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { useRoutineContext } from "@/context/RoutineContext";
import WorkoutForm from "@/components/workout/WorkoutForm";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import ExerciseModal from "@/components/modals/exercises/ExerciseModal";
import * as crypto from "expo-crypto";
import { Routine } from "@/types/Global";
import FinishModal from "@/components/modals/confirmation/FinishModal";
import DiscardModal from "@/components/modals/confirmation/DiscardModal";

export default function CreateRoutineScreen() {
  const { setRoutines } = useRoutineContext();

  const [routine, setRoutine] = useState<Routine>({
    id: crypto.randomUUID(),
    name: "",
    exercises: [],
    notes: "",
  });

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [finishModalVisible, setFinishModalVisible] = useState<boolean>(false);
  const [discardModalVisible, setDiscardModalVisible] =
    useState<boolean>(false);

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
            onPress={() => setFinishModalVisible(true)}
          />
        );
      },
      headerLeft: () => {
        return (
          <EvilIcons
            name="chevron-left"
            color={"black"}
            size={32}
            onPress={() => setDiscardModalVisible(true)}
          />
        );
      },
    });
  }, [navigation, finishModalVisible]);

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
        placeholder="discard your current workout?"
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
      <WorkoutForm
        setDraft={setRoutine}
        draft={routine}
        setModalVisible={setModalVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({});
