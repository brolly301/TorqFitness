import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { ReactNode } from "react";
import { ModalProps } from "@/types/Global";

type Props = ModalProps & {
  children: ReactNode;
};

export default function AppModal({
  children,
  modalVisible,
  setModalVisible,
}: Props) {
  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <View style={styles.centeredView}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setModalVisible(false)}
        />
        <View style={styles.modalView}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
