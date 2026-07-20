import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { ModalProps, Workout } from "@/types/Global";
import WorkoutDetails from "./WorkoutDetails";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = ModalProps & {
  workout: Workout;
  returnTo: "/(tabs)/workout" | "/(tabs)/history";
};

export default function WorkoutDetailsModal({
  modalVisible,
  setModalVisible,
  workout,
  returnTo,
}: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.modalView}>
          <WorkoutDetails
            returnTo={returnTo}
            workout={workout}
            setModalVisible={setModalVisible}
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
      maxHeight: "72%",
      minHeight: 220 * scale,
      overflow: "hidden",
      paddingTop: 20 * scale,
      paddingHorizontal: 18 * scale,
      paddingBottom: 18 * scale,
      borderRadius: 22 * scale,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
    },
  });