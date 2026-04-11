import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { ModalProps, Workout } from "@/types/Global";
import WorkoutDetails from "./WorkoutDetails";

type Props = ModalProps & { workout: Workout };

export default function WorkoutDetailsModal({
  modalVisible,
  setModalVisible,
  workout,
}: Props) {
  return (
    <>
      <Modal visible={modalVisible}>
        <View style={styles.centeredView}>
          <Pressable
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.modalView}>
            <WorkoutDetails
              workout={workout}
              setModalVisible={setModalVisible}
            />
          </View>
        </View>
      </Modal>
    </>
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
