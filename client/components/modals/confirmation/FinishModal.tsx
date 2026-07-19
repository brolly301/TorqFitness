import React from "react";
import { ModalProps } from "@/types/Global";
import ConfirmationModal from "./ConfirmationModal";

type Props = ModalProps & {
  onConfirm: () => void;
  placeholder: string;
  isConfirming?: boolean;
};

export default function FinishModal({
  modalVisible,
  setModalVisible,
  onConfirm,
  isConfirming = false,
  placeholder,
}: Props) {
  return (
    <ConfirmationModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      title="Finish and save?"
      description={`Are you sure you are finished ${placeholder}`}
      confirmText="Finish & Save"
      confirmVariant="primary"
      isConfirming={isConfirming}
      onConfirm={onConfirm}
    />
  );
}
