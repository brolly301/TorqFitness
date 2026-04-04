import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import AppSearchBar from "@/components/ui/AppSearchBar";
import ExerciseList from "@/components/exercises/ExerciseList";
import { ModalProps } from "@/types/Global";
import { useExerciseContext } from "@/context/ExerciseContext";
import { normalize } from "@/utils/helpers";

type Props = ModalProps & {
  handleAddExercise: (exerciseId: string) => void;
};

export default function ExerciseModal({
  modalVisible,
  setModalVisible,
  handleAddExercise,
}: Props) {
  const [search, setSearch] = useState<string>("");
  const { exercises } = useExerciseContext();

  const filteredExercises = exercises.filter((exercise) =>
    normalize(exercise.name).includes(normalize(search)),
  );

  return (
    <Modal visible={modalVisible}>
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.modalView}>
          <AppSearchBar setSearch={setSearch} />
          <ExerciseList
            exercises={filteredExercises}
            handleAddExercise={handleAddExercise}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    width: "89%",
    height: "60%",
    borderRadius: 12,
    backgroundColor: "white",
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 26,
  },
});
