import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import TileWrapper from "./TileWrapper";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import Feather from "@expo/vector-icons/Feather";
import { useUserContext } from "@/context/UserContext";
import { useSettingsContext } from "@/context/SettingsContext";
import { capitalizeWords, formatHeight, formatWeight } from "@/utils/helpers";
import { router } from "expo-router";

export default function DetailsTile() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const { user } = useUserContext();
  const { settings } = useSettingsContext();

  const weightUnit = settings?.weightLabel ?? "kg";
  const profile = user?.profile;

  const details = [
    {
      label: "Height",
      value:
        profile?.heightCm != null
          ? formatHeight(profile.heightCm, weightUnit)
          : "Not set",
    },
    {
      label: "Weight",
      value:
        user?.currentWeightKg != null
          ? formatWeight(user.currentWeightKg, weightUnit)
          : "Not set",
    },
    {
      label: "Goal Weight",
      value:
        profile?.goalWeightKg != null
          ? formatWeight(profile.goalWeightKg, weightUnit)
          : "Not set",
    },
    {
      label: "Experience Level",
      value: profile?.experienceLevel
        ? capitalizeWords(profile.experienceLevel.toLowerCase())
        : "Not set",
    },
  ];
  return (
    <TileWrapper title="Your Details">
     <View style={styles.container}>
  {details.map((item, index) => (
    <React.Fragment key={item.label}>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>{item.label}</Text>

        <Text style={styles.rowValue} numberOfLines={1}>
          {item.value}
        </Text>
      </View>

      {index !== details.length - 1 && (
        <View style={styles.separator} />
      )}
    </React.Fragment>
  ))}

  <Pressable
    style={({ pressed }) => [
      styles.editButton,
      pressed && styles.editButtonPressed,
    ]}
    onPress={() => router.push("/(tabs)/profile/editDetails")}
    accessibilityRole="button"
    accessibilityLabel="Edit profile details"
  >
    <Text style={styles.editButtonText}>Edit details</Text>

    <Feather
      name="chevron-right"
      size={17 * scale}
      color={theme.buttonPrimary}
    />
  </Pressable>
</View>
    </TileWrapper>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 12 * scale,
      paddingTop: 5 * scale,
      paddingBottom: 12 * scale,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 45 * scale,
      paddingVertical: 10 * scale,
    },

    rowLabel: {
      flex: 1,
      marginRight: 12 * scale,
      color: theme.text,
      fontSize: 14 * scale,
      fontWeight: "500",
    },

    rowValue: {
      flexShrink: 1,
      color: theme.textSecondary,
      fontSize: 14 * scale,
      textAlign: "right",
    },

    separator: {
      width: "100%",
      height: 1,
      backgroundColor: theme.border,
    },

    editButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7 * scale,
      minHeight: 42 * scale,
      marginTop: 12 * scale,
      backgroundColor: theme.buttonPrimary + "12",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "35",
      borderRadius: 11 * scale,
    },

    editButtonPressed: {
      opacity: 0.7,
    },

    editButtonText: {
      color: theme.buttonPrimary,
      fontSize: 14 * scale,
      fontWeight: "700",
    },
  });