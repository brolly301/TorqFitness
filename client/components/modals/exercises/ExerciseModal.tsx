import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import AppSearchBar from "@/components/ui/AppSearchBar";
import ExerciseList from "@/components/exercises/ExerciseList";
import { ModalProps } from "@/types/Global";
import { useExerciseContext } from "@/context/ExerciseContext";
import { normalize } from "@/utils/helpers";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import AntDesign from "@expo/vector-icons/AntDesign";

type Props = ModalProps & {
  handleAddExercise: (exerciseId: string) => void;
};

export default function ExerciseModal({
  modalVisible,
  setModalVisible,
  handleAddExercise,
}: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const [search, setSearch] = useState("");
  const { exercises } = useExerciseContext();

  useEffect(() => {
    if (!modalVisible) {
      setSearch("");
    }
  }, [modalVisible]);

  const filteredExercises = useMemo(() => {
    return exercises.filter(
      (exercise) =>
        normalize(exercise.name).includes(normalize(search)) &&
        !exercise.archived,
    );
  }, [exercises, search]);

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.overlay}>
        <Pressable
          onPress={() => setModalVisible(false)}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Exercise</Text>

            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
              hitSlop={8}
            >
              <AntDesign name="close" size={18 * scale} color={theme.text} />
            </Pressable>
          </View>

          <Text style={styles.description}>
            Search your exercise library and choose one to add
          </Text>

          <View style={styles.searchContainer}>
            <AppSearchBar setSearch={setSearch} />
          </View>

          <View style={styles.listContainer}>
            <ExerciseList
              exercises={filteredExercises}
              handleAddExercise={handleAddExercise}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.shadow,
      paddingHorizontal: 16 * scale,
    },

    modalView: {
      width: "100%",
      maxWidth: 420,
      height: "72%",
      borderRadius: 20 * scale,
      backgroundColor: theme.background,
      paddingTop: 16 * scale,
      paddingHorizontal: 16 * scale,
      paddingBottom: 16 * scale,
      borderWidth: 1,
      borderColor: theme.border,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8 * scale,
    },

    title: {
      fontSize: 24 * scale,
      fontWeight: "700",
      color: theme.text,
    },

    closeButton: {
      width: 36 * scale,
      height: 36 * scale,
      borderRadius: 10 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    description: {
      fontSize: 14 * scale,
      lineHeight: 20 * scale,
      color: theme.textSecondary,
      marginBottom: 14 * scale,
    },

    searchContainer: {
      marginBottom: 8 * scale,
    },

    listContainer: {
      flex: 1,
    },
  });
