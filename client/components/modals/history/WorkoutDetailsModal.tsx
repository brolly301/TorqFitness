import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { ModalProps, Workout } from "@/types/Global";
import WorkoutDetails from "./WorkoutDetails";
import WorkoutEditForm from "./WorkoutEditForm";

type Props = ModalProps & { workout: Workout };

export default function WorkoutDetailsModal({
  modalVisible,
  setModalVisible,
  workout,
}: Props) {
  const [activeEdit, setActiveEdit] = useState<boolean>(false);

  return (
    <Modal visible={modalVisible}>
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => {
            setModalVisible(!modalVisible);
            setActiveEdit(false);
          }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.modalView}>
          {!activeEdit ? (
            <WorkoutDetails workout={workout} setActiveEdit={setActiveEdit} />
          ) : (
            <WorkoutEditForm setActiveEdit={setActiveEdit} workout={workout} />
          )}
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
