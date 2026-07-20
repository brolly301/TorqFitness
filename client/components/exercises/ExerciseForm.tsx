import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Theme } from "@/types/Theme";
import { useExerciseContext } from "@/context/ExerciseContext";
import { Exercise } from "@/types/Global";
import AppDropdown from "../ui/AppDropdown";
import {
  bodyParts,
  equipment,
  primaryMuscles,
} from "@/constants/exerciseDropdowns";
import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  exercise: Exercise;
  setExercise: React.Dispatch<React.SetStateAction<Exercise>>;
};

export default function ExerciseForm({ exercise, setExercise }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { addExercise } = useExerciseContext();
  const [isNameFocused, setIsNameFocused] = useState(false);

  const isDisabled =
    !exercise.name.trim() ||
    exercise.primaryMuscles.length === 0 ||
    exercise.bodyParts.length === 0 ||
    exercise.equipment.length === 0;

  const handleSubmit = async () => {
    if (isDisabled) return;

    try {
      await addExercise(exercise);
      router.back();
    } catch {
      //toDo with error handling phase
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Exercise Name</Text>
      <TextInput
        placeholder="Name"
        returnKeyType="done"
        placeholderTextColor={theme.textSecondary}
        onFocus={() => setIsNameFocused(true)}
        onBlur={() => setIsNameFocused(false)}
        style={[
          styles.input,
          {
            borderColor: isNameFocused
              ? theme.inputFocusBorder
              : theme.inputBorder,
          },
        ]}
        textAlignVertical="center"
        value={exercise.name}
        onChangeText={(text) =>
          setExercise((prev) => ({ ...prev, name: text }))
        }
      />

      <Text style={styles.label}>Primary Muscle</Text>
      <AppDropdown
        selected={exercise.primaryMuscles[0] || ""}
        data={primaryMuscles}
        setSelected={(selected) =>
          setExercise((prev) => ({
            ...prev,
            primaryMuscles: selected ? [selected] : [],
          }))
        }
        placeholder="Select a muscle"
      />

      <Text style={styles.label}>Body Part</Text>
      <AppDropdown
        selected={exercise.bodyParts[0] || ""}
        data={bodyParts}
        setSelected={(selected) =>
          setExercise((prev) => ({
            ...prev,
            bodyParts: selected ? [selected] : [],
          }))
        }
        placeholder="Select a body part"
      />

      <Text style={styles.label}>Equipment</Text>
      <AppDropdown
        selected={exercise.equipment[0] || ""}
        data={equipment}
        setSelected={(selected) =>
          setExercise((prev) => ({
            ...prev,
            equipment: selected ? [selected] : [],
          }))
        }
        placeholder="Select equipment"
      />

     <Pressable
  onPress={handleSubmit}
  disabled={isDisabled}
  style={({ pressed }) => [
    styles.button,
    isDisabled ? styles.buttonDisabled : styles.buttonEnabled,
    pressed && !isDisabled && styles.buttonPressed,
  ]}
>
  <Text
    style={[
      styles.buttonText,
      isDisabled
        ? styles.buttonDisabledText
        : styles.buttonEnabledText,
    ]}
  >
    Save Exercise
  </Text>

 
</Pressable>
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      padding: 16 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14 * scale,
      elevation: 4,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.06,
      shadowRadius: 10,
    },

    label: {
      marginBottom: 6 * scale,
      color: theme.textSecondary,
      fontSize: 13 * scale,
      fontWeight: "500",
    },

    input: {
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8 * scale,
      minHeight: 46 * scale,
      marginTop: 10 * scale,
      paddingHorizontal: 16 * scale,
      borderWidth: 1,
      borderRadius: 12 * scale,
    },

    buttonEnabled: {
      backgroundColor: theme.buttonPrimary + "14",
      borderColor: theme.buttonPrimary + "40",
    },

    buttonDisabled: {
      backgroundColor: theme.buttonDisabled,
      borderColor: theme.border,
    },

    buttonPressed: {
      backgroundColor: theme.buttonPrimary + "24",
    },

    buttonText: {
      fontSize: 15 * scale,
      fontWeight: "700",
    },

    buttonEnabledText: {
      color: theme.buttonPrimary,
    },

    buttonDisabledText: {
      color: theme.buttonDisabledText,
    },
  });