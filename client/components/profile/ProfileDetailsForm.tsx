import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import AppDropdown from "@/components/ui/AppDropdown";
import WeightInput from "@/components/workout/WeightInput";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useSettingsContext } from "@/context/SettingsContext";
import { useUserContext } from "@/context/UserContext";
import { Theme } from "@/types/Theme";
import { ExperienceLevel } from "@/types/User";

const EXPERIENCE_OPTIONS = ["Beginner", "Intermediate", "Advanced"] as const;

type ExperienceOption = (typeof EXPERIENCE_OPTIONS)[number];

const experienceToOption = (
  level: ExperienceLevel | null | undefined,
): ExperienceOption | "" => {
  switch (level) {
    case "BEGINNER":
      return "Beginner";
    case "INTERMEDIATE":
      return "Intermediate";
    case "ADVANCED":
      return "Advanced";
    default:
      return "";
  }
};

const optionToExperience = (
  option: ExperienceOption | "",
): ExperienceLevel | null => {
  return option ? (option.toUpperCase() as ExperienceLevel) : null;
};

export default function ProfileDetailsForm() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { user, updateProfile, recordWeight } = useUserContext();
  const { settings } = useSettingsContext();

  const weightUnit = settings?.weightLabel ?? "kg";
  const usesImperial = weightUnit === "lb";

  const initialHeightCm = user?.profile?.heightCm ?? null;

  const initialTotalInches =
    initialHeightCm != null ? Math.round(initialHeightCm / 2.54) : null;

  const [heightCmText, setHeightCmText] = useState(
    initialHeightCm != null ? String(initialHeightCm) : "",
  );

  const [heightFeetText, setHeightFeetText] = useState(
    initialTotalInches != null
      ? String(Math.floor(initialTotalInches / 12))
      : "",
  );

  const [heightInchesText, setHeightInchesText] = useState(
    initialTotalInches != null ? String(initialTotalInches % 12) : "",
  );

  const [currentWeightKg, setCurrentWeightKg] = useState<number | null>(
    user?.currentWeightKg ?? null,
  );

  const [goalWeightKg, setGoalWeightKg] = useState<number | null>(
    user?.profile?.goalWeightKg ?? null,
  );

  const [experience, setExperience] = useState<ExperienceOption | "">(
    experienceToOption(user?.profile?.experienceLevel),
  );

  const [isSaving, setIsSaving] = useState(false);

  const getHeightCm = () => {
    if (!usesImperial) {
      const height = Number(heightCmText.replace(",", "."));

      return height > 0 ? height : null;
    }

    const feet = Number(heightFeetText) || 0;
    const inches = Number(heightInchesText) || 0;
    const totalInches = feet * 12 + inches;

    if (totalInches <= 0) return null;

    return Math.round(totalInches * 2.54 * 10) / 10;
  };

  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);

      await updateProfile({
        heightCm: getHeightCm(),
        goalWeightKg,
        experienceLevel: optionToExperience(experience),
      });

      const weightChanged =
        currentWeightKg != null && currentWeightKg !== user?.currentWeightKg;

      if (weightChanged) {
        await recordWeight(currentWeightKg);
      }

      router.back();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Height</Text>

      {usesImperial ? (
        <View style={styles.heightRow}>
          <View style={styles.heightInputContainer}>
            <TextInput
              value={heightFeetText}
              onChangeText={setHeightFeetText}
              placeholder="0"
              keyboardType="number-pad"
              placeholderTextColor={theme.textSecondary}
              style={styles.input}
            />
            <Text style={styles.inputUnit}>ft</Text>
          </View>

          <View style={styles.heightInputContainer}>
            <TextInput
              value={heightInchesText}
              onChangeText={setHeightInchesText}
              placeholder="0"
              keyboardType="number-pad"
              placeholderTextColor={theme.textSecondary}
              style={styles.input}
            />
            <Text style={styles.inputUnit}>in</Text>
          </View>
        </View>
      ) : (
        <View style={styles.heightInputContainer}>
          <TextInput
            value={heightCmText}
            onChangeText={setHeightCmText}
            placeholder="0"
            keyboardType="decimal-pad"
            placeholderTextColor={theme.textSecondary}
            style={styles.input}
          />
          <Text style={styles.inputUnit}>cm</Text>
        </View>
      )}

      <Text style={styles.label}>Current Weight</Text>
      <View style={styles.weightInputContainer}>
        <WeightInput
          storedWeight={currentWeightKg}
          unit={weightUnit}
           surface="secondary"
          onChange={setCurrentWeightKg}
        />
      </View>

      <Text style={styles.label}>Goal Weight</Text>
      <View style={styles.weightInputContainer}>
        <WeightInput
          storedWeight={goalWeightKg}
          unit={weightUnit}
           surface="secondary"
          onChange={setGoalWeightKg}
        />
      </View>

      <Text style={styles.label}>Experience Level</Text>
      <AppDropdown
        data={[...EXPERIENCE_OPTIONS]}
        selected={experience}
        setSelected={setExperience}
        placeholder="Select your experience"
      />

    <Pressable
  onPress={handleSave}
  disabled={isSaving}
  style={({ pressed }) => [
    styles.saveButton,
    isSaving && styles.saveButtonDisabled,
    pressed && !isSaving && styles.saveButtonPressed,
  ]}
>
  <Text
    style={[
      styles.saveButtonText,
      isSaving && styles.saveButtonDisabledText,
    ]}
  >
    {isSaving ? "Saving..." : "Save Details"}
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
    },

    label: {
      marginBottom: 6 * scale,
      color: theme.textSecondary,
      fontSize: 13 * scale,
      fontWeight: "500",
    },

    heightRow: {
      flexDirection: "row",
      gap: 10 * scale,
    },

    heightInputContainer: {
      flex: 1,
      minHeight: 46 * scale,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16 * scale,
      paddingHorizontal: 12 * scale,
      backgroundColor: theme.buttonSecondary,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: 12 * scale,
    },

    input: {
      flex: 1,
      padding: 0,
      color: theme.text,
      fontSize: 16 * scale,
      textAlign: "center",
    },

    inputUnit: {
      marginLeft: 4 * scale,
      color: theme.textSecondary,
      fontSize: 14 * scale,
    },

    weightInputContainer: {
      minHeight: 46 * scale,
      flexDirection: "row",
      marginBottom: 16 * scale,
      overflow: "hidden",
      backgroundColor: theme.buttonSecondary,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: 12 * scale,
    },

    saveButton: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 46 * scale,
      paddingHorizontal: 16 * scale,
      backgroundColor: theme.buttonPrimary + "14",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "40",
      borderRadius: 12 * scale,
    },

    saveButtonDisabled: {
      backgroundColor: theme.buttonDisabled,
      borderColor: theme.border,
    },

    saveButtonPressed: {
      opacity: 0.7,
    },

    saveButtonText: {
      color: theme.buttonPrimary,
      fontSize: 15 * scale,
      fontWeight: "700",
    },

    saveButtonDisabledText: {
      color: theme.buttonDisabledText,
    },
  });