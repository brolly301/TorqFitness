import React from "react";
import { ModalProps } from "@/types/Global";
import ConfirmationModal from "./ConfirmationModal";

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
    <ConfirmationModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      title="Finish and save?"
      description={`Are you sure you are finished ${placeholder}`}
      confirmText="Finish & Save"
      confirmVariant="primary"
      onConfirm={onConfirm}
    />
  );
}
