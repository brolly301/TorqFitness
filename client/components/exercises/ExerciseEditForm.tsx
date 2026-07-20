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
import { toggleToast } from "@/utils/toggleToast";

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
  const [isSaving, setIsSaving] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  useEffect(() => {
    setExerciseData(exercise);
  }, [exercise]);

  const handleCloseAll = () => {
    if (isSaving || isArchiving) return;

    setEditModalVisible(false);
    setModalVisible(false);
  };

  const handleBack = () => {
    setEditModalVisible(false);
  };

  const handleSave = async () => {
    if (!exerciseData || isDisabled || isSaving) return;

    try {
      setIsSaving(true);

      await updateExercise(exerciseData);

      setEditModalVisible(false);
      setModalVisible(false);
    } catch (error) {
      toggleToast({
        type: "error",
        text1: "Exercise not saved",
        text2:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!exerciseData || isArchiving) return;

    try {
      setIsArchiving(true);

      await archiveExercise(exerciseData.id);

      setDeleteModalVisible(false);
      setEditModalVisible(false);
      setModalVisible(false);
    } catch (error) {
      toggleToast({
        type: "error",
        text1: "Exercise not archived",
        text2:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsArchiving(false);
    }
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
            disabled={isArchiving}
            onPress={handleArchive}
          >
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
              {isArchiving ? "Archiving..." : "Archive"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.cancelButton]}
            disabled={isArchiving}
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
  <Pressable
    style={styles.iconButton}
    onPress={handleBack}
    hitSlop={8}
    accessibilityRole="button"
    accessibilityLabel="Return to exercise details"
  >
    <AntDesign
      name="arrow-left"
      size={18 * scale}
      color={theme.text}
    />
  </Pressable>

  <Text style={styles.title}>Edit Exercise</Text>

  <Pressable
    style={styles.iconButton}
    onPress={handleCloseAll}
    hitSlop={8}
    accessibilityRole="button"
    accessibilityLabel="Close exercise details"
  >
    <AntDesign
      name="close"
      size={18 * scale}
      color={theme.text}
    />
  </Pressable>
</View>

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
  disabled={isDisabled || isSaving}
  onPress={handleSave}
  style={({ pressed }) => [
    styles.button,
    styles.saveButton,
    (isDisabled || isSaving) && styles.disabledButton,
    pressed && !isDisabled && !isSaving && styles.buttonPressed,
  ]}
>
  <Text
    style={[
      styles.buttonText,
      isDisabled || isSaving
        ? styles.disabledButtonText
        : styles.saveButtonText,
    ]}
  >
    {isSaving ? "Saving..." : "Save Exercise"}
  </Text>
</Pressable>

<Pressable
  onPress={() => setDeleteModalVisible(true)}
  style={({ pressed }) => [
    styles.button,
    styles.archiveButton,
    pressed && styles.buttonPressed,
  ]}
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
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16 * scale,
      backgroundColor: theme.shadow,
    },

    modalView: {
      width: "100%",
      maxWidth: 420,
      height: "72%",
      paddingTop: 16 * scale,
      paddingHorizontal: 16 * scale,
      paddingBottom: 16 * scale,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 20 * scale,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20 * scale,
    },

    iconButton: {
      width: 36 * scale,
      height: 36 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10 * scale,
    },

    title: {
      flex: 1,
      marginHorizontal: 12 * scale,
      color: theme.text,
      fontSize: 18 * scale,
      fontWeight: "700",
      textAlign: "center",
    },

    label: {
      marginBottom: 6 * scale,
      color: theme.textSecondary,
      fontSize: 13 * scale,
      fontWeight: "500",
    },

    input: {
      minHeight: 46 * scale,
      marginBottom: 16 * scale,
      paddingHorizontal: 12 * scale,
      paddingVertical: 12 * scale,
      backgroundColor: theme.buttonSecondary,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: 12 * scale,
      color: theme.text,
      fontSize: 15 * scale,
    },

    button: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44 * scale,
      paddingHorizontal: 16 * scale,
      borderWidth: 1,
      borderRadius: 12 * scale,
    },

    buttonText: {
      fontSize: 14 * scale,
      fontWeight: "700",
    },

    saveButton: {
      marginTop: 2 * scale,
      marginBottom: 10 * scale,
      backgroundColor: theme.buttonPrimary + "14",
      borderColor: theme.buttonPrimary + "40",
    },

    saveButtonText: {
      color: theme.buttonPrimary,
    },

    disabledButton: {
      backgroundColor: theme.buttonDisabled,
      borderColor: theme.border,
    },

    disabledButtonText: {
      color: theme.buttonDisabledText,
    },

    archiveButton: {
      backgroundColor: theme.error + "12",
      borderColor: theme.error + "35",
    },

    archiveButtonText: {
      color: theme.error,
    },

    buttonPressed: {
      opacity: 0.7,
    },

    deleteContainer: {
      width: "100%",
      maxWidth: 420,
      padding: 20 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 18 * scale,
    },

    deleteTitle: {
      marginBottom: 8 * scale,
      color: theme.text,
      fontSize: 20 * scale,
      fontWeight: "700",
      textAlign: "center",
    },

    description: {
      marginBottom: 18 * scale,
      color: theme.textSecondary,
      fontSize: 15 * scale,
      lineHeight: 21 * scale,
      textAlign: "center",
    },

    buttonContainer: {
      gap: 10 * scale,
    },

    actionButton: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44 * scale,
      paddingHorizontal: 16 * scale,
      borderRadius: 12 * scale,
    },

    actionButtonText: {
      fontSize: 15 * scale,
      fontWeight: "700",
    },

    dangerButton: {
      backgroundColor: theme.error,
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
      color: theme.buttonSecondaryText ?? theme.text,
      fontSize: 15 * scale,
      fontWeight: "600",
    },
  });