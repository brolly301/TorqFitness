import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { ReactNode, useMemo } from "react";
import { ModalProps } from "@/types/Global";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type Props = ModalProps & {
  children: ReactNode;
};

export default function AppModal({
  children,
  modalVisible,
  setModalVisible,
}: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
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

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.6)",
    },
    modalView: {
      width: "89%",
      height: "60%",
      borderRadius: 12 * scale,
      backgroundColor: theme.background,
      paddingTop: 15 * scale,
      paddingHorizontal: 15 * scale,
      paddingBottom: 26 * scale,
    },
  });
