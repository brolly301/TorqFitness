import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { capitalizeWords } from "@/utils/helpers";
import { router } from "expo-router";
import { Routine } from "@/types/Global";
import { useRoutineContext } from "@/context/RoutineContext";
import { useExerciseContext } from "@/context/ExerciseContext";
import DeleteModal from "../confirmation/DeleteModal";

type Props = {
  routine: Routine;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RoutineDetails({ routine, setModalVisible }: Props) {
  const { deleteRoutine } = useRoutineContext();
  const { exercises } = useExerciseContext();

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const exerciseList = routine.exercises.map((rtEx) => {
    const details = exercises.find(
      (exercise) => exercise.id === rtEx.exerciseId,
    );
    return { ...rtEx, details };
  });

  const totalSets = routine.exercises.reduce(
    (total, ex) => total + ex.sets.length,
    0,
  );

  return (
    <>
      <DeleteModal
        modalVisible={deleteModalVisible}
        setModalVisible={setDeleteModalVisible}
        placeholder="routine"
        onConfirm={() => deleteRoutine(routine.id)}
      />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Pressable
            style={styles.buttonContainer}
            onPress={() => {
              setDeleteModalVisible(true);
            }}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
          <Pressable
            style={[
              styles.buttonContainer,
              {
                borderColor: "rgba(6, 134, 12, 0.44)",
                backgroundColor: "rgba(6, 134, 12, 0.2)",
              },
            ]}
            onPress={() => {
              router.navigate({
                pathname: "/(tabs)/routines/editRoutine",
                params: { routineId: routine.id },
              });
              setModalVisible(false);
            }}
          >
            <Text
              style={[styles.buttonText, { color: "rgba(6, 134, 12, 0.44)" }]}
            >
              Edit
            </Text>
          </Pressable>
        </View>
        <FlatList
          data={exerciseList}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => {
            return (
              <View style={styles.overviewContainer}>
                <Text style={styles.name}>{routine.name}</Text>
                <Text style={styles.notes}>{routine.notes}</Text>
                <View style={styles.hr} />
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.exerciseLength}>
                    {routine.exercises.length} Exercise
                  </Text>
                  <Text style={{ fontSize: 18 }}> • </Text>
                  <Text style={styles.setLength}>{totalSets} Sets</Text>
                </View>
              </View>
            );
          }}
          renderItem={({ item }) => {
            return (
              <View key={item.id} style={styles.routineContainer}>
                <View style={styles.nameButtonContainer}>
                  <Text style={styles.exerciseName}>
                    {capitalizeWords(item.details?.name ?? "")}
                  </Text>
                  <Text style={styles.exerciseMuscle}>
                    {capitalizeWords(item.details?.primaryMuscles[0] ?? "")} &{" "}
                    {capitalizeWords(item.details?.secondaryMuscles[0] ?? "")}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  {Array.from({ length: item.sets.length }, (_, i) => (
                    <Text>•</Text>
                  ))}
                </View>
              </View>
            );
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  routineContainer: {
    marginTop: 15,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  nameButtonContainer: {
    // flexDirection: "row",
    justifyContent: "center",
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  exerciseMuscle: {
    fontSize: 15,
    fontWeight: "400",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  overviewContainer: {
    marginTop: 20,
  },
  notes: {
    fontSize: 16,
  },
  exerciseLength: { fontSize: 16 },
  setLength: { fontSize: 16 },
  hr: {
    marginVertical: 10,
    height: 1,
    width: "100%",
    backgroundColor: "black",
  },
  buttonContainer: {
    padding: 7.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 0, 0.6)",
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "rgba(255, 0, 0, 0.6)",
  },
});
