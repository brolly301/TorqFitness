import { Pressable, StyleSheet, Text, View,ScrollView } from "react-native";
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
   <ScrollView
  style={styles.container}
  contentContainerStyle={styles.contentContainer}
  showsVerticalScrollIndicator={false}
>
     <View style={styles.header}>
  <View style={styles.titleContainer}>
    <Text style={styles.title}>Profile</Text>
    <Text style={styles.description}>Your training hub</Text>
  </View>

  <Pressable
    style={styles.settingsButton}
    onPress={() => router.navigate("/(tabs)/profile/settings")}
    hitSlop={10}
    accessibilityRole="button"
    accessibilityLabel="Open settings"
  >
    <Feather
      name="settings"
      size={21 * scale}
      color={theme.buttonPrimary}
    />
  </Pressable>
</View>
        <StatsTile />
        <ProgressTile />
        <DetailsTile />
    </ScrollView>
    </AppWrapper>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    contentContainer: {
      flexGrow: 1,
      paddingTop: 12 * scale,
      paddingHorizontal: 16 * scale,
      paddingBottom: 28 * scale,
    },

    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 18 * scale,
    },

    titleContainer: {
      flex: 1,
      marginRight: 16 * scale,
    },

    title: {
      marginBottom: 4 * scale,
      color: theme.text,
      fontSize: 32 * scale,
      fontWeight: "700",
    },

    description: {
      color: theme.textSecondary,
      fontSize: 16 * scale,
      fontWeight: "400",
      lineHeight: 22 * scale,
    },

    settingsButton: {
      width: 40 * scale,
      height: 40 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12 * scale,
    },
  });