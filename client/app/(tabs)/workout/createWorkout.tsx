import { Pressable, StyleSheet, Text, View } from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import WorkoutForm from "@/components/workout/WorkoutForm";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import ExerciseModal from "@/components/modals/exercises/ExerciseModal";
import * as crypto from "expo-crypto";
import { Workout } from "@/types/Global";
import FinishModal from "@/components/modals/confirmation/FinishModal";
import DiscardModal from "@/components/modals/confirmation/DiscardModal";
import AppWrapper from "@/components/ui/AppWrapper";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import Feather from "@expo/vector-icons/Feather";
import { useRoutineContext } from "@/context/RoutineContext";

export default function StartWorkoutScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { addWorkout, workouts } = useWorkoutContext();
  const { routines } = useRoutineContext();
  const { routineId } = useLocalSearchParams();

  const routine = routines.find((routine) => routine.id === routineId);

  useEffect(() => {
    if (routine) {
      setWorkout((prev) => ({
        ...prev,
        exercises: routine.exercises.map((exercise) => ({
          ...exercise,
          id: crypto.randomUUID(),
          sets: exercise.sets.map((set) => ({
            ...set,
            id: crypto.randomUUID(),
          })),
        })),
      }));
    }
  }, [routine]);

  const [workout, setWorkout] = useState<Workout>({
    id: crypto.randomUUID(),
    name: `Workout #${workouts.length + 1}`,
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

    addWorkout(finalWorkout);
    router.back();
  }, [workout, addWorkout]);

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
                Finish
              </Text>
              <Feather name="check" color={theme.buttonPrimary} size={24} />
            </Pressable>
          </View>
          <WorkoutForm
            mode="workout"
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
