import { Modal, Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { Exercise, ModalProps } from "@/types/Global";
import ExerciseEditForm from "@/components/exercises/ExerciseEditForm";

type Props = { exercise: Exercise | null } & ModalProps;

export default function ExerciseEditModal({
  modalVisible,
  setModalVisible,
  exercise,
}: Props) {
  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => setModalVisible(false)}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.modalView}>
          <ExerciseEditForm
            setModalVisible={setModalVisible}
            exercise={exercise}
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
