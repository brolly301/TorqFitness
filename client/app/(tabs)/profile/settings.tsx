import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import SettingsList from "@/components/profile/settings/SettingsList";
import AppWrapper from "@/components/ui/AppWrapper";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

export default function SettingsScreen() {
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
  <Pressable
    style={({ pressed }) => [
      styles.backButton,
      pressed && styles.backButtonPressed,
    ]}
    onPress={() => router.back()}
    hitSlop={10}
    accessibilityRole="button"
    accessibilityLabel="Return to profile"
  >
    <Feather
      name="arrow-left"
      size={22 * scale}
      color={theme.text}
    />
  </Pressable>

  <View style={styles.titleContainer}>
    <Text style={styles.title}>Settings</Text>
    <Text style={styles.description}>Make the app yours</Text>
  </View>
</View>
        <SettingsList />
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
      alignItems: "center",
      marginBottom: 20 * scale,
    },

    backButton: {
      width: 40 * scale,
      height: 40 * scale,
      marginRight: 12 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12 * scale,
    },

    backButtonPressed: {
      opacity: 0.7,
    },

    titleContainer: {
      flex: 1,
    },

    title: {
      marginBottom: 2 * scale,
      color: theme.text,
      fontSize: 25 * scale,
      fontWeight: "700",
    },

    description: {
      color: theme.textSecondary,
      fontSize: 13 * scale,
      lineHeight: 18 * scale,
    },
  });