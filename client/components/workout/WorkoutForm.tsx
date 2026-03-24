import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Button } from "@react-navigation/elements";
import { router } from "expo-router";
import Timer from "./Timer";
import { Workout } from "@/types/Global";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { useExerciseContext } from "@/context/ExerciseContext";

type Props = {
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
};

export default function WorkoutForm({ workouts, setWorkouts }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    decription: "",
  });

  const { workoutExercises, setWorkoutExercises } = useWorkoutContext();
  const { exercises } = useExerciseContext();

  const exerciseList = workoutExercises.map((we) => {
    const details = exercises.find((ex) => ex.id === we.exerciseId);

    return { ...we, details };
  });

  const handleSubmit = () => {};

  return (
    <>
      <View>
        <Timer />
        <TextInput
          placeholder="Workout #1"
          placeholderTextColor={"black"}
          // onChangeText={}
          style={styles.nameInput}
        />
        <TextInput
          placeholder="Enter description"
          placeholderTextColor={"black"}
          // onChangeText={}
          style={styles.nameInput}
        />
        {exerciseList
          ? exerciseList.map((exercise) => {
              return (
                <View style={styles.workoutContainer}>
                  <Text>{exercise.details?.name}</Text>
                  {exercise.sets.map((set) => {
                    return (
                      <View style={styles.exerciseContainer}>
                        <View style={styles.exerciseInputContainer}>
                          <Text>Set</Text>
                          <TextInput
                            placeholder={set.order.toString()}
                            placeholderTextColor={"black"}
                            // onChangeText={}
                            style={styles.nameInput}
                          />
                        </View>
                        <View style={styles.exerciseInputContainer}>
                          <Text>Reps</Text>

                          <TextInput
                            placeholder={set.reps.toString()}
                            placeholderTextColor={"black"}
                            // onChangeText={}
                            style={styles.nameInput}
                          />
                        </View>
                        <View style={styles.exerciseInputContainer}>
                          <Text>kg</Text>
                          <TextInput
                            placeholder={set.weight?.toString()}
                            placeholderTextColor={"black"}
                            // onChangeText={}
                            style={styles.nameInput}
                          />
                        </View>
                      </View>
                    );
                  })}

                  <Button>Add set</Button>
                </View>
              );
            })
          : null}

        <Button onPress={() => router.push("../../(modals)/exercise")}>
          Add Exercise
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  nameInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  workoutContainer: {
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  exerciseInputContainer: {
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
  },
});
