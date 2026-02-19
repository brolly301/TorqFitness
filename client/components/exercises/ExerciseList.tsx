import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Exercise } from "@/types/Global";
import ExerciseItem from "./ExerciseItem";
import ExerciseDetailsModal from "../modals/exercises/ExerciseDetailsModal";

type Props = {
  exercises: Exercise[];
};

export default function ExerciseList({ exercises }: Props) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [exercise, setExercise] = useState<Exercise | null>(null);

  return (
    <>
      <ExerciseDetailsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        exercise={exercise}
      />
      ex
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => {
                setExercise(item);
                setModalVisible(true);
              }}
            >
              <ExerciseItem exercise={item} />
            </Pressable>
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({});
