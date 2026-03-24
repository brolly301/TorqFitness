import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import WorkoutForm from "@/components/workout/WorkoutForm";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { useNavigation } from "expo-router";
import EvilIcons from "@expo/vector-icons/EvilIcons";

export default function StartWorkoutScreen() {
  const { workouts, setWorkouts } = useWorkoutContext();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <EvilIcons name="check" color={"black"} size={22} />;
      },
    });
  }, [navigation]);

  return (
    <View>
      <WorkoutForm setWorkouts={setWorkouts} workouts={workouts} />
    </View>
  );
}

const styles = StyleSheet.create({});
