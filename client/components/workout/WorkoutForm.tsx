import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button } from "@react-navigation/elements";
import Timer from "./Timer";
import { ModalProps, WorkoutDraft } from "@/types/Global";
import { useExerciseContext } from "@/context/ExerciseContext";
import { addSet, removeExercise, updateSet } from "@/utils/workoutUtil";
import { capitalizeWords, formatDate } from "@/utils/helpers";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Props<T extends WorkoutDraft> = {
  draft: T;
  setDraft: React.Dispatch<React.SetStateAction<T>>;
  showTimer?: boolean;
} & Pick<ModalProps, "setModalVisible">;

export default function WorkoutForm<T extends WorkoutDraft>({
  draft,
  setDraft,
  showTimer,
  setModalVisible,
}: Props<T>) {
  const { exercises } = useExerciseContext();

  const exerciseList = draft.exercises.map((we) => {
    const details = exercises.find((ex) => ex.id === we.exerciseId);

    return { ...we, details };
  });

  const updateForm = (field: "name" | "notes", value: string) => {
    setDraft((prev) => {
      return { ...prev, [field]: value };
    });
  };

  const date = new Date();

  const totalVolume = exerciseList.reduce((workoutTotal, exercise) => {
    const exerciseVolume = exercise.sets.reduce(
      (setTotal, set) => Number(set.reps) * Number(set.weight) + setTotal,
      0,
    );
    return workoutTotal + exerciseVolume;
  }, 0);

  const totalSets = exerciseList.reduce(
    (total, exercise) => total + exercise.sets.length,
    0,
  );

  return (
    <>
      <View>
        <View style={styles.nameTimer}>
          <View>
            <TextInput
              placeholder="Workout #1"
              placeholderTextColor={"black"}
              value={draft.name}
              onChangeText={(text) => updateForm("name", text)}
              style={styles.nameInput}
            />
            <View style={{ flexDirection: "row" }}>
              <Text>Volume {totalVolume}kg</Text>
              <Text> • </Text>
              <Text>{totalSets} sets</Text>
            </View>
          </View>
          <View>
            <Text style={styles.date}>{formatDate(date)}</Text>
            <Timer />
          </View>
        </View>
        <View style={styles.hr} />
        <TextInput
          placeholder="Enter workout notes"
          placeholderTextColor={"black"}
          value={draft.notes}
          onChangeText={(text) => updateForm("notes", text)}
          style={styles.notesInput}
        />
        <View style={styles.hr} />
        {exerciseList
          ? exerciseList.map((exercise) => {
              return (
                <View key={exercise.id} style={styles.workoutContainer}>
                  <View style={styles.nameButtonContainer}>
                    <Text style={styles.exerciseName}>
                      {capitalizeWords(exercise.details?.name ?? "")}
                    </Text>
                    <EvilIcons
                      onPress={() => removeExercise(setDraft, exercise.id)}
                      name="trash"
                      size={30}
                      color={"red"}
                    />
                  </View>
                  <View style={styles.headerContainer}>
                    <View style={styles.exerciseInputContainer}>
                      <Text>Set</Text>
                    </View>
                    <View style={styles.exerciseInputContainer}>
                      <Text>Reps</Text>
                    </View>
                    <View style={styles.exerciseInputContainer}>
                      <Text>Weight</Text>
                    </View>
                  </View>
                  {exercise.sets.map((set) => {
                    return (
                      <View key={set.id} style={styles.exerciseContainer}>
                        <View style={styles.exerciseInputContainer}>
                          <TextInput
                            placeholder={set.order.toString()}
                            placeholderTextColor={"black"}
                            style={styles.nameInput}
                          />
                        </View>
                        <View style={styles.exerciseInputContainer}>
                          <TextInput
                            placeholder={set.reps.toString()}
                            placeholderTextColor={"black"}
                            onChangeText={(text) =>
                              updateSet(
                                setDraft,
                                exercise.id,
                                set.id,
                                "reps",
                                parseInt(text),
                              )
                            }
                            style={styles.nameInput}
                          />
                        </View>
                        <View style={styles.exerciseInputContainer}>
                          <TextInput
                            placeholder={set.weight?.toString()}
                            placeholderTextColor={"black"}
                            onChangeText={(text) =>
                              updateSet(
                                setDraft,
                                exercise.id,
                                set.id,
                                "weight",
                                parseInt(text),
                              )
                            }
                            style={styles.nameInput}
                          />
                        </View>
                      </View>
                    );
                  })}

                  <Button onPressIn={() => addSet(setDraft, exercise.id)}>
                    Add set
                  </Button>
                </View>
              );
            })
          : null}
        <Button onPress={() => setModalVisible(true)}>Add Exercise</Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  nameInput: {
    fontSize: 24,
  },
  notesInput: {
    fontSize: 18,
  },
  date: { fontSize: 22 },
  nameTimer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    // marginBottom: 15,
  },
  workoutContainer: {
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  exerciseInputContainer: {
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    marginBottom: 10,
  },
  exerciseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    gap: 8,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    gap: 8,
  },
  nameButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  hr: {
    height: 1,
    backgroundColor: "black",
    marginVertical: 15,
  },
});
