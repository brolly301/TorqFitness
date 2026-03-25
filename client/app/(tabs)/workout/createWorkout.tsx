import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useLayoutEffect } from "react";
import WorkoutForm from "@/components/workout/WorkoutForm";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { router, useNavigation } from "expo-router";
import EvilIcons from "@expo/vector-icons/EvilIcons";

export default function StartWorkoutScreen() {
  const { workout, setWorkout, setWorkouts, resetWorkout } =
    useWorkoutContext();

  const navigation = useNavigation();

  console.log(workout);

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
    resetWorkout();
    router.back();
  }, [workout, setWorkouts, resetWorkout]);

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

  return (
    <View>
      <WorkoutForm setDraft={setWorkout} draft={workout} target={"workout"} />
    </View>
  );
}

const styles = StyleSheet.create({});
