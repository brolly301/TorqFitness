import React from "react";
import { ModalProps } from "@/types/Global";
import ConfirmationModal from "./ConfirmationModal";

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
    <ConfirmationModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      title="Discard changes?"
      description={`Are you sure you want to ${placeholder} Your unsaved changes will be lost.`}
      confirmText="Discard"
      confirmVariant="danger"
      onConfirm={onConfirm}
    />
  );
}
