import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ModalProps } from "@/types/Global";
import AppModal from "@/components/ui/AppModal";
import { Button } from "@react-navigation/elements";

type Props = ModalProps & {
  placeholder: string;
  onConfirm: () => void;
};

export default function DiscardModal({
  modalVisible,
  setModalVisible,
  placeholder,
  onConfirm,
}: Props) {
  return (
    <AppModal modalVisible={modalVisible} setModalVisible={setModalVisible}>
      <View>
        <Text>Are you sure you want to {placeholder}</Text>
        <Button onPressIn={onConfirm}>Yes, discard changes</Button>
        <Button onPressIn={() => setModalVisible(false)}>Cancel</Button>
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({});
