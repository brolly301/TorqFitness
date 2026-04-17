import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import AppWrapper from "@/components/ui/AppWrapper";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { Theme } from "@/types/Theme";
import StatsTile from "@/components/profile/StatsTile";
import ProgressTile from "@/components/profile/ProgressTile";
import DetailsTile from "@/components/profile/DetailsTile";

export default function ProfileScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <AppWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.navigate("/(tabs)/profile/settings")}
            hitSlop={10}
          >
            <Feather
              name="settings"
              size={22 * scale}
              color={theme.buttonPrimary}
            />
          </Pressable>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.description}>Your training hub</Text>
        </View>
        <StatsTile />
        <ProgressTile />
        <DetailsTile />
      </View>
    </AppWrapper>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16 * scale,
      paddingTop: 12 * scale,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      marginBottom: 12 * scale,
    },

    backButton: {
      width: 40 * scale,
      height: 40 * scale,
      borderRadius: 12 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    titleContainer: {
      marginBottom: 18 * scale,
    },

    title: {
      fontSize: 32 * scale,
      fontWeight: "700",
      marginBottom: 4 * scale,
      color: theme.text,
    },

    description: {
      fontSize: 16 * scale,
      fontWeight: "400",
      color: theme.textSecondary,
      lineHeight: 22 * scale,
    },
  });
