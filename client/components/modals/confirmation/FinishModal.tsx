import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ModalProps } from "@/types/Global";
import AppModal from "@/components/ui/AppModal";
import { Button } from "@react-navigation/elements";

type Props = ModalProps & {
  onConfirm: () => void;
  placeholder: string;
};

export default function FinishModal({
  modalVisible,
  setModalVisible,
  onConfirm,
  placeholder,
}: Props) {
  return (
    <AppModal modalVisible={modalVisible} setModalVisible={setModalVisible}>
      <View>
        <Text>Are you sure you are finished {placeholder}</Text>
        <Button onPressIn={onConfirm}>Yes, finish & save workout</Button>
        <Button onPressIn={() => setModalVisible(false)}>Cancel</Button>
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({});
