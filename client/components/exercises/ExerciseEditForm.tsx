import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useMemo, useState } from "react";
import { useExerciseContext } from "@/context/ExerciseContext";
import AppDropdown from "../ui/AppDropdown";
import { Button } from "@react-navigation/elements";
import {
  bodyParts,
  equipment,
  primaryMuscles,
} from "@/constants/exerciseDropdowns";
import { Exercise, ModalProps } from "@/types/Global";
import DeleteModal from "../modals/confirmation/DeleteModal";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = { exercise: Exercise | null } & Pick<
  ModalProps,
  "setModalVisible"
>;

export default function ExerciseEditForm({ exercise, setModalVisible }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  if (!exercise) return null;

  const [exerciseData, setExerciseData] = useState<Exercise>(exercise);

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  console.log(exerciseData.name);

  const isDisabled = !exercise.name.trim() || !exerciseData.name.trim();
  exercise.primaryMuscles.length === 0 ||
    exercise.bodyParts.length === 0 ||
    exercise.equipment.length === 0;

  const { updateExercise, archiveExercise } = useExerciseContext();

  const handleSubmit = () => {
    updateExercise(exerciseData);
    setModalVisible(false);
  };

  const onConfirm = () => {
    archiveExercise(exerciseData.id);
    setModalVisible(false);
  };

  return (
    <>
      <DeleteModal
        modalVisible={deleteModalVisible}
        setModalVisible={setDeleteModalVisible}
        placeholder="workout"
        onConfirm={onConfirm}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Edit Exercise</Text>
        <Text style={styles.label}>Name</Text>

        <TextInput
          placeholder="Name"
          placeholderTextColor="black"
          style={styles.input}
          textAlignVertical="center"
          value={exerciseData.name}
          onChangeText={(text) =>
            setExerciseData((prev) => ({ ...prev, name: text }))
          }
        />
        <Text style={styles.label}>Primary Muscle</Text>

        <AppDropdown
          selected={exerciseData.primaryMuscles[0] || ""}
          data={primaryMuscles}
          setSelected={(selected) =>
            setExerciseData((prev) => ({
              ...prev,
              primaryMuscles: selected ? [selected] : [],
            }))
          }
          placeholder="Select a muscle"
        />
        <Text style={styles.label}>Body Part</Text>

        <AppDropdown
          selected={exerciseData.bodyParts[0] || ""}
          data={bodyParts}
          setSelected={(selected) =>
            setExerciseData((prev) => ({
              ...prev,
              bodyParts: selected ? [selected] : [],
            }))
          }
          placeholder="Select a body part"
        />
        <Text style={styles.label}>Equipment</Text>

        <AppDropdown
          selected={exerciseData.equipment[0] || ""}
          data={equipment}
          setSelected={(selected) =>
            setExerciseData((prev) => ({
              ...prev,
              equipment: selected ? [selected] : [],
            }))
          }
          placeholder="Select equipment"
        />

        <Pressable
          disabled={isDisabled}
          onPress={handleSubmit}
          style={[
            styles.button,
            {
              backgroundColor: isDisabled
                ? theme.buttonDisabled
                : theme.buttonPrimary,
              marginBottom: 10,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: isDisabled
                  ? theme.buttonDisabledText
                  : theme.buttonPrimaryText,
              },
            ]}
          >
            Save Exercise
          </Text>
        </Pressable>
        <Pressable
          disabled={isDisabled}
          onPress={() => {
            setDeleteModalVisible(true);
          }}
          style={[
            styles.button,
            {
              backgroundColor: theme.error,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: theme.buttonPrimaryText,
              },
            ]}
          >
            Archive Exercise
          </Text>
        </Pressable>
      </View>
    </>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: { padding: 16 * scale },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
    },
    label: {
      fontSize: 13 * scale,
      color: theme.textSecondary,
      marginBottom: 5,
    },
    input: {
      borderWidth: 1 * scale,
      borderColor: theme.border,
      padding: 12 * scale,
      marginBottom: 8 * scale,
      borderRadius: 6 * scale,
    },
    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      paddingVertical: 10 * scale,
    },
    buttonText: {
      fontSize: 14 * scale,
      fontWeight: "bold",
    },
  });
