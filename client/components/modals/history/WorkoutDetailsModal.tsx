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
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      backgroundColor: theme.shadow,
    },
    modalView: {
      width: "89%",
      maxHeight: "60%",
      minHeight: 200,
      borderRadius: 12,
      backgroundColor: theme.background,
      paddingTop: 15,
      paddingHorizontal: 15,
      paddingBottom: 15,
    },
  });
