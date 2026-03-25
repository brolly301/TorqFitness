import { StyleSheet, View } from "react-native";
import React, { useCallback, useLayoutEffect } from "react";
import { router, useNavigation } from "expo-router";
import { useRoutineContext } from "@/context/RoutineContext";
import WorkoutForm from "@/components/workout/WorkoutForm";
import EvilIcons from "@expo/vector-icons/EvilIcons";

export default function CreateRoutineScreen() {
  const { resetRoutine, routine, setRoutine, setRoutines } =
    useRoutineContext();

  const navigation = useNavigation();

  const handleSubmit = useCallback(() => {
    if (!routine) return;

    setRoutines((prev) => [...prev, routine]);
    resetRoutine();
    router.back();
  }, [routine, setRoutines, resetRoutine]);

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
      <WorkoutForm setDraft={setRoutine} draft={routine} target={"routine"} />
    </View>
  );
}

const styles = StyleSheet.create({});
