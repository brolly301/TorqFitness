import React from "react";
import { ModalProps } from "@/types/Global";
import ConfirmationModal from "./ConfirmationModal";

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
    <ConfirmationModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      title={`Delete ${placeholder}?`}
      description={`This will permanently remove this ${placeholder}. This action cannot be undone.`}
      confirmText="Delete"
      confirmVariant="danger"
      onConfirm={onConfirm}
    />
  );
}
