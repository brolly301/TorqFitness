import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useExerciseContext } from "@/context/ExerciseContext";
import AppDropdown from "../ui/AppDropdown";
import {
  bodyParts,
  equipment,
  primaryMuscles,
} from "@/constants/exerciseDropdowns";
import { Exercise, ModalProps } from "@/types/Global";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  exercise: Exercise | null;
  setEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
} & Pick<ModalProps, "setModalVisible">;

export default function ExerciseEditForm({
  exercise,
  setModalVisible,
  setEditModalVisible,
}: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const { updateExercise, archiveExercise } = useExerciseContext();

  const [exerciseData, setExerciseData] = useState<Exercise | null>(exercise);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    setExerciseData(exercise);
  }, [exercise]);

  const handleCloseAll = () => {
    setEditModalVisible(false);
    setModalVisible(false);
  };

  const handleBack = () => {
    setEditModalVisible(false);
  };

  const handleSave = () => {
    if (!exerciseData || isDisabled) return;

    updateExercise(exerciseData);
    setModalVisible(false);
  };

  const handleArchive = () => {
    if (!exerciseData) return;

    archiveExercise(exerciseData.id);
    setModalVisible(false);
  };

  if (!exerciseData) return null;

  const isDisabled =
    !exerciseData.name.trim() ||
    exerciseData.primaryMuscles.length === 0 ||
    exerciseData.bodyParts.length === 0 ||
    exerciseData.equipment.length === 0;

  return deleteModalVisible ? (
    <View style={styles.overlay}>
      <Pressable onPress={handleCloseAll} style={StyleSheet.absoluteFill} />

      <View style={styles.deleteContainer}>
        <Text style={styles.deleteTitle}>Archive Exercise</Text>

        <Text style={styles.description}>
          This will archive this exercise. This action cannot be undone
        </Text>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleArchive}
          >
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
              Archive
            </Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => setDeleteModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.overlay}>
      <Pressable onPress={handleCloseAll} style={StyleSheet.absoluteFill} />

      <View style={styles.modalView}>
        <View style={styles.header}>
          <Pressable style={styles.iconButton} onPress={handleBack} hitSlop={8}>
            <AntDesign name="arrow-left" size={18 * scale} color={theme.text} />
          </Pressable>

          <Pressable
            style={styles.iconButton}
            onPress={() => setModalVisible(false)}
            hitSlop={8}
          >
            <AntDesign name="close" size={18 * scale} color={theme.text} />
          </Pressable>
        </View>

        <Text style={styles.title}>Edit Exercise</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Name"
          returnKeyType="done"
          placeholderTextColor={theme.textSecondary}
          style={styles.input}
          textAlignVertical="center"
          value={exerciseData.name}
          onChangeText={(text) =>
            setExerciseData((prev) => (prev ? { ...prev, name: text } : prev))
          }
        />

        <Text style={styles.label}>Primary Muscle</Text>
        <AppDropdown
          selected={exerciseData.primaryMuscles[0] || ""}
          data={primaryMuscles}
          setSelected={(selected) =>
            setExerciseData((prev) =>
              prev
                ? {
                    ...prev,
                    primaryMuscles: selected ? [selected] : [],
                  }
                : prev,
            )
          }
          placeholder="Select a muscle"
        />

        <Text style={styles.label}>Body Part</Text>
        <AppDropdown
          selected={exerciseData.bodyParts[0] || ""}
          data={bodyParts}
          setSelected={(selected) =>
            setExerciseData((prev) =>
              prev
                ? {
                    ...prev,
                    bodyParts: selected ? [selected] : [],
                  }
                : prev,
            )
          }
          placeholder="Select a body part"
        />

        <Text style={styles.label}>Equipment</Text>
        <AppDropdown
          selected={exerciseData.equipment[0] || ""}
          data={equipment}
          setSelected={(selected) =>
            setExerciseData((prev) =>
              prev
                ? {
                    ...prev,
                    equipment: selected ? [selected] : [],
                  }
                : prev,
            )
          }
          placeholder="Select equipment"
        />

        <Pressable
          disabled={isDisabled}
          onPress={handleSave}
          style={[
            styles.button,
            styles.saveButton,
            isDisabled && styles.disabledButton,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              isDisabled ? styles.disabledButtonText : styles.saveButtonText,
            ]}
          >
            Save Exercise
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setDeleteModalVisible(true)}
          style={[styles.button, styles.archiveButton]}
        >
          <Text style={[styles.buttonText, styles.archiveButtonText]}>
            Archive Exercise
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.55)",
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
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14 * scale,
    },

    iconButton: {
      width: 36 * scale,
      height: 36 * scale,
      borderRadius: 10 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    title: {
      fontSize: 18 * scale,
      fontWeight: "700",
      textAlign: "center",
      color: theme.text,
      marginBottom: 20 * scale,
    },

    label: {
      fontSize: 13 * scale,
      color: theme.textSecondary,
      marginBottom: 5 * scale,
    },

    input: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
      color: theme.text,
      padding: 12 * scale,
      marginBottom: 8 * scale,
      borderRadius: 6 * scale,
    },

    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10 * scale,
      paddingVertical: 10 * scale,
    },

    buttonText: {
      fontSize: 14 * scale,
      fontWeight: "700",
    },

    saveButton: {
      backgroundColor: theme.buttonPrimary,
      marginBottom: 10 * scale,
    },

    saveButtonText: {
      color: theme.buttonPrimaryText,
    },

    disabledButton: {
      backgroundColor: theme.buttonDisabled,
    },

    disabledButtonText: {
      color: theme.buttonDisabledText,
    },

    archiveButton: {
      backgroundColor: theme.error,
    },

    archiveButtonText: {
      color: theme.buttonPrimaryText,
    },

    deleteContainer: {
      width: "100%",
      maxWidth: 420,
      backgroundColor: theme.card,
      borderRadius: 18 * scale,
      padding: 20 * scale,
      borderWidth: 1,
      borderColor: theme.border,
    },

    deleteTitle: {
      fontSize: 20 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8 * scale,
      textAlign: "center",
    },

    description: {
      fontSize: 15 * scale,
      lineHeight: 21 * scale,
      color: theme.textSecondary,
      marginBottom: 18 * scale,
      textAlign: "center",
    },

    buttonContainer: {
      gap: 10 * scale,
    },

    actionButton: {
      borderRadius: 12 * scale,
      paddingVertical: 12 * scale,
      alignItems: "center",
      justifyContent: "center",
    },

    actionButtonText: {
      fontSize: 15 * scale,
      fontWeight: "700",
    },

    dangerButton: {
      backgroundColor: theme.error ?? "#DC2626",
    },

    dangerButtonText: {
      color: "#FFFFFF",
    },

    cancelButton: {
      backgroundColor: theme.buttonSecondary,
      borderWidth: 1,
      borderColor: theme.border,
    },

    cancelButtonText: {
      fontSize: 15 * scale,
      fontWeight: "600",
      color: theme.buttonSecondaryText ?? theme.text,
    },
  });
