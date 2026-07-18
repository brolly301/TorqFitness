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
          onChange={setCurrentWeightKg}
        />
      </View>

      <Text style={styles.label}>Goal Weight</Text>
      <View style={styles.weightInputContainer}>
        <WeightInput
          storedWeight={goalWeightKg}
          unit={weightUnit}
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
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
      >
        <Text style={styles.saveButtonText}>
          {isSaving ? "Saving..." : "Save Details"}
        </Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      borderRadius: 14 * scale,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16 * scale,
    },

    label: {
      fontSize: 14 * scale,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 6 * scale,
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
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: 12 * scale,
      backgroundColor: theme.buttonSecondary,
      paddingHorizontal: 12 * scale,
      marginBottom: 16 * scale,
    },

    input: {
      flex: 1,
      fontSize: 16 * scale,
      color: theme.text,
      textAlign: "center",
      padding: 0,
    },

    inputUnit: {
      fontSize: 14 * scale,
      color: theme.textSecondary,
      marginLeft: 4 * scale,
    },

    weightInputContainer: {
      minHeight: 46 * scale,
      flexDirection: "row",
      marginBottom: 16 * scale,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: 12 * scale,
      overflow: "hidden",
    },

    saveButton: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12 * scale,
      paddingVertical: 13 * scale,
      backgroundColor: theme.buttonPrimary,
    },

    saveButtonDisabled: {
      opacity: 0.6,
    },

    saveButtonText: {
      fontSize: 15 * scale,
      fontWeight: "700",
      color: theme.buttonPrimaryText,
    },
  });
