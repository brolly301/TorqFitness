import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import AppSearchBar from "@/components/ui/AppSearchBar";
import ExerciseList from "@/components/exercises/ExerciseList";
import { ModalProps } from "@/types/Global";
import { useExerciseContext } from "@/context/ExerciseContext";
import { normalize } from "@/utils/helpers";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = ModalProps & {
  handleAddExercise: (exerciseId: string) => void;
};

export default function ExerciseModal({
  modalVisible,
  setModalVisible,
  handleAddExercise,
}: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const [search, setSearch] = useState<string>("");
  const { exercises } = useExerciseContext();

  const filteredExercises = exercises.filter(
    (exercise) =>
      normalize(exercise.name).includes(normalize(search)) &&
      !exercise.archived,
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

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
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
