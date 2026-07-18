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
            <Pressable
              style={styles.row}
              onPress={() => router.push("/(tabs)/profile/editDetails")}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${item.label}`}
            >
              <Text style={styles.rowLabel}>{item.label}</Text>

              <View style={styles.rowRight}>
                <Text style={styles.rowValue}>{item.value}</Text>
                <Feather
                  style={styles.rowArrow}
                  name="arrow-right"
                  size={18 * scale}
                  color={theme.textMuted}
                />
              </View>
            </Pressable>

            {index !== details.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
        ))}
      </View>
    </TileWrapper>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: { paddingHorizontal: 12, paddingVertical: 6 },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12 * scale,
    },

    rowRight: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 12 * scale,
    },

    rowLabel: {
      flex: 1,
      fontSize: 15 * scale,
      fontWeight: "500",
      color: theme.text,
    },

    rowValue: {
      fontSize: 15 * scale,
      fontWeight: "400",
      color: theme.textSecondary,
    },

    rowArrow: {
      marginLeft: 8 * scale,
    },

    separator: {
      width: "100%",
      height: 1,
      backgroundColor: theme.border,
      opacity: 0.5,
    },
  });
