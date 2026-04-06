import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Workout } from "@/types/Global";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { capitalizeWords } from "@/utils/helpers";
import { Button } from "@react-navigation/elements";
import { router } from "expo-router";
import { useExerciseContext } from "@/context/ExerciseContext";
import DeleteModal from "../confirmation/DeleteModal";

type Props = {
  workout: Workout;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function WorkoutDetails({ workout, setModalVisible }: Props) {
  const { deleteWorkout } = useWorkoutContext();
  const { exercises } = useExerciseContext();

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const exerciseList = workout.exercises.map((we) => {
    const details = exercises.find((ex) => ex.id === we.exerciseId);

    return { ...we, details };
  });

  return (
    <>
      <DeleteModal
        modalVisible={deleteModalVisible}
        setModalVisible={setDeleteModalVisible}
        placeholder="workout"
        onConfirm={() => deleteWorkout(workout.id)}
      />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <EvilIcons
            name="trash"
            size={40}
            color={"red"}
            onPress={() => {
              setDeleteModalVisible(true);
            }}
          />
          <EvilIcons
            name="pencil"
            size={40}
            color={"black"}
            onPress={() => {
              router.navigate({
                pathname: "/(tabs)/history/editWorkout",
                params: { workoutId: workout.id },
              });
              setModalVisible(false);
            }}
          />
        </View>
        <FlatList
          data={exerciseList}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => {
            return (
              <View>
                <TextInput
                  style={styles.input}
                  value={workout.name}
                  editable={false}
                />
                <TextInput
                  style={styles.input}
                  value={workout.notes}
                  editable={false}
                />
              </View>
            );
          }}
          renderItem={({ item }) => {
            return (
              <View key={item.id} style={styles.workoutContainer}>
                <View style={styles.nameButtonContainer}>
                  <Text style={styles.exerciseName}>
                    {capitalizeWords(item.details?.name ?? "")}
                  </Text>
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
                {item.sets.map((set) => {
                  return (
                    <View key={set.id} style={styles.exerciseContainer}>
                      <View style={styles.exerciseInputContainer}>
                        <TextInput
                          placeholder={set.order.toString()}
                          placeholderTextColor={"black"}
                          style={styles.nameInput}
                          editable={false}
                        />
                      </View>
                      <View style={styles.exerciseInputContainer}>
                        <TextInput
                          placeholder={set.reps.toString()}
                          placeholderTextColor={"black"}
                          editable={false}
                          style={styles.nameInput}
                        />
                      </View>
                      <View style={styles.exerciseInputContainer}>
                        <TextInput
                          placeholder={set.weight?.toString()}
                          placeholderTextColor={"black"}
                          editable={false}
                          style={styles.nameInput}
                        />
                      </View>
                    </View>
                  );
                })}
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
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    marginBottom: 10,
  },
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
});
