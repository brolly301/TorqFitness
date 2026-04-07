import { StyleSheet, Text, View } from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import WorkoutForm from "@/components/workout/WorkoutForm";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { router, useNavigation } from "expo-router";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import ExerciseModal from "@/components/modals/exercises/ExerciseModal";
import * as crypto from "expo-crypto";
import { Workout } from "@/types/Global";
import FinishModal from "@/components/modals/confirmation/FinishModal";
import DiscardModal from "@/components/modals/confirmation/DiscardModal";
import AppWrapper from "@/components/ui/AppWrapper";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function StartWorkoutScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

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
  const [finishModalVisible, setFinishModalVisible] = useState<boolean>(false);
  const [discardModalVisible, setDiscardModalVisible] =
    useState<boolean>(false);

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
        placeholder={"with this workout?"}
      />
      <ExerciseModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleAddExercise={handleAddExercise}
      />
      <AppWrapper>
        <View style={styles.container}>
          <WorkoutForm
            setDraft={setWorkout}
            draft={workout}
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
  });
