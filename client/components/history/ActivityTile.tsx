import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Workout } from "@/types/Global";
import WorkoutDetailsModal from "../modals/history/WorkoutDetailsModal";

type Props = {
  workout: Workout;
};

export default function ActivityTile({ workout }: Props) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <>
      <WorkoutDetailsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        workout={workout}
      />

      <Pressable
        style={styles.container}
        onPress={() => setModalVisible(!modalVisible)}
      >
        <Text style={styles.name}>{workout.name}</Text>
        <Text style={styles.date}>{workout.startedAt}</Text>
        {workout.exercises.map((exercise) => {
          return (
            <View style={styles.exerciseContainer}>
              <Text style={styles.exerciseName}>{exercise.exerciseId}</Text>
            </View>
          );
        })}
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  name: {
    color: "black",
    fontSize: 20,
    fontWeight: "600",
  },

  date: {
    fontSize: 14,
  },
  exerciseContainer: {},
  exerciseName: {},
});
