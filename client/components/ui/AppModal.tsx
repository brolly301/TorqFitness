import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { ReactNode, useMemo } from "react";
import { ModalProps } from "@/types/Global";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type Props = ModalProps & {
  children: ReactNode;
  dismissDisabled?: boolean;
};

export default function AppModal({
  children,
  modalVisible,
  dismissDisabled = false,
  setModalVisible,
}: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const handleClose = () => {
    if (dismissDisabled) return;
    setModalVisible(false);
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <View style={styles.modalView}>{children}</View>
      </View>
    </Modal>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16 * scale,
      backgroundColor: theme.shadow,
    },

    modalView: {
      width: "100%",
      maxWidth: 420,
    },
  });