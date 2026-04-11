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

  const handleSubmit = () => {
    if (isDisabled) return;

    addExercise(exercise);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Exercise Name</Text>
      <TextInput
        placeholder="Name"
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
        style={[
          styles.button,
          {
            backgroundColor: isDisabled
              ? theme.buttonDisabled
              : theme.buttonPrimary,
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
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      padding: 16 * scale,
      backgroundColor: theme.card,
      borderRadius: 14 * scale,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 4,
    },

    label: {
      fontSize: 13 * scale,
      color: theme.textSecondary,
      marginBottom: 6 * scale,
    },

    input: {
      borderRadius: 12 * scale,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      paddingHorizontal: 12 * scale,
      paddingVertical: 12 * scale,
      backgroundColor: theme.buttonSecondary,
      marginBottom: 16 * scale,
      fontSize: 15 * scale,
      color: theme.text,
    },

    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12 * scale,
      paddingVertical: 12 * scale,
      marginTop: 10 * scale,
    },

    buttonText: {
      fontSize: 15 * scale,
      fontWeight: "700",
    },
  });
