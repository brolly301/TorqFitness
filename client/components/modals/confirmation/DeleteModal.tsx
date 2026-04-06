import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppModal from "@/components/ui/AppModal";
import { ModalProps } from "@/types/Global";
import { Button } from "@react-navigation/elements";

type Props = ModalProps & {
  onConfirm: () => void;
  placeholder: string;
};

export default function DeleteModal({
  modalVisible,
  setModalVisible,
  placeholder,
  onConfirm,
}: Props) {
  return (
    <AppModal modalVisible={modalVisible} setModalVisible={setModalVisible}>
      <View>
        <Text>Are you sure you want to delete this {placeholder}?</Text>
        <Button onPressIn={onConfirm}>Yes, delete.</Button>
        <Button onPressIn={() => setModalVisible(false)}>Cancel</Button>
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({});
