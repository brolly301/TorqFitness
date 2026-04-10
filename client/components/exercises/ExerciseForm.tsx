import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Theme } from "@/types/Theme";
import { Button } from "@react-navigation/elements";
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

  const isDisabled =
    !exercise.name.trim() ||
    exercise.primaryMuscles.length === 0 ||
    exercise.bodyParts.length === 0 ||
    exercise.equipment.length === 0;

  const { addExercise } = useExerciseContext();

  const handleSubmit = () => {
    addExercise(exercise);
    router.back();
  };

  const [active, setActive] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Exercise Name</Text>
      <TextInput
        placeholder="Name"
        placeholderTextColor="black"
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        style={[
          styles.input,
          { borderColor: active ? theme.inputFocusBorder : theme.inputBorder },
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
        style={[
          styles.button,
          {
            backgroundColor: isDisabled
              ? theme.buttonDisabled
              : theme.buttonPrimary,
          },
        ]}
        disabled={isDisabled}
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
    input: {
      borderRadius: 10 * scale,
      borderWidth: 1 * scale,
      borderColor: theme.inputBorder,
      padding: 10 * scale,
      backgroundColor: theme.buttonSecondary,
      marginBottom: 15 * scale,
    },
    label: {
      fontSize: 13 * scale,
      color: theme.textSecondary,
      marginBottom: 5,
    },
    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 10 * scale,
    },
    buttonText: {
      fontSize: 14 * scale,
      fontWeight: "bold",
    },
    container: {
      padding: 16,
      backgroundColor: theme.card,
      borderRadius: 12,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 6,
    },
  });
