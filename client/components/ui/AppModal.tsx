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
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.shadow,
    },
    modalView: {
      width: "89%",
      borderRadius: 12 * scale,
      paddingTop: 15 * scale,
      paddingHorizontal: 15 * scale,
      paddingBottom: 26 * scale,
    },
  });
