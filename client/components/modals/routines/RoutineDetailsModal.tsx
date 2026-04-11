import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ModalProps, Routine } from "@/types/Global";
import RoutineDetails from "./RoutineDetails";

type Props = ModalProps & { routine: Routine };

export default function RoutineDetailsModal({
  modalVisible,
  setModalVisible,
  routine,
}: Props) {
  return (
    <Modal visible={modalVisible}>
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.modalView}>
          <RoutineDetails routine={routine} setModalVisible={setModalVisible} />
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
