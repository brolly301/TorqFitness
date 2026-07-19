import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { ModalProps, Routine } from "@/types/Global";
import RoutineDetails from "./RoutineDetails";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = ModalProps & {
  routine: Routine;
  returnTo: "/(tabs)/workout" | "/(tabs)/routines";
};

export default function RoutineDetailsModal({
  modalVisible,
  setModalVisible,
  routine,
  returnTo,
}: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.modalView}>
          <RoutineDetails
            routine={routine}
            setModalVisible={setModalVisible}
            returnTo={returnTo}
          />
        </View>
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
      maxWidth: 460,
      maxHeight: "82%",
      minHeight: 240 * scale,
      borderRadius: 22 * scale,
      paddingTop: 20 * scale,
      paddingHorizontal: 18 * scale,
      paddingBottom: 18 * scale,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: "hidden",
    },
  });