import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import RoutineList from "@/components/routines/RoutineList";
import { useRoutineContext } from "@/context/RoutineContext";
import AppWrapper from "@/components/ui/AppWrapper";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

export default function RoutineScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { routines } = useRoutineContext();

  return (
    <AppWrapper>
      <View style={styles.container}>
       <View style={styles.header}>
  <View style={styles.titleContainer}>
    <Text style={styles.title}>Routines</Text>
    <Text style={styles.description}>Plan. Save. Repeat.</Text>
  </View>

  <Pressable
    style={styles.addButton}
    accessibilityRole="button"
    accessibilityLabel="Create routine"
    hitSlop={10}
    onPress={() => router.push("/(tabs)/routines/createRoutine")}
  >
    <Feather
      name="plus"
      size={20 * scale}
      color={theme.buttonPrimary}
    />
  </Pressable>
</View>

        <View style={styles.listContainer}>
          {routines.length > 0 ? (
            <RoutineList routines={routines} />
          ) : (
           <View style={styles.placeholderContainer}>
  <View style={styles.placeholderIcon}>
    <Feather
      name="layers"
      size={24 * scale}
      color={theme.buttonPrimary}
    />
  </View>

  <Text style={styles.placeholderTitle}>No routines yet</Text>

  <Text style={styles.placeholderText}>
    Build a reusable workout plan and start training faster.
  </Text>

  <Pressable
    style={({ pressed }) => [
      styles.placeholderButton,
      pressed && styles.placeholderButtonPressed,
    ]}
    onPress={() => router.push("/(tabs)/routines/createRoutine")}
    accessibilityRole="button"
    accessibilityLabel="Create your first routine"
  >
    <Feather
      name="plus"
      size={17 * scale}
      color={theme.buttonPrimary}
    />
    <Text style={styles.placeholderButtonText}>
      Create your first routine
    </Text>
  </Pressable>
</View>
          )}
        </View>
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
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 18 * scale,
    },

    titleContainer: {
      flex: 1,
      marginRight: 16 * scale,
    },

    title: {
      fontSize: 32 * scale,
      fontWeight: "700",
      marginBottom: 4 * scale,
      color: theme.text,
    },

    description: {
      fontSize: 16 * scale,
      lineHeight: 22 * scale,
      fontWeight: "400",
      color: theme.textSecondary,
    },

    addButton: {
      width: 40 * scale,
      height: 40 * scale,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    listContainer: {
      flex: 1,
    },

    placeholderContainer: {
      marginTop: 8 * scale,
      alignItems: "center",
      paddingVertical: 32 * scale,
      paddingHorizontal: 22 * scale,
      borderRadius: 18 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    placeholderIcon: {
      width: 52 * scale,
      height: 52 * scale,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 16 * scale,
      marginBottom: 16 * scale,
      backgroundColor: theme.buttonPrimary + "14",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "25",
    },

    placeholderTitle: {
      fontSize: 18 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 7 * scale,
    },

    placeholderText: {
      maxWidth: 280 * scale,
      fontSize: 14 * scale,
      lineHeight: 20 * scale,
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: 20 * scale,
    },

    placeholderButton: {
      minHeight: 44 * scale,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8 * scale,
      paddingHorizontal: 16 * scale,
      borderRadius: 12 * scale,
      backgroundColor: theme.buttonPrimary + "14",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "40",
    },

    placeholderButtonPressed: {
      backgroundColor: theme.buttonPrimary + "24",
    },

    placeholderButtonText: {
      fontSize: 14 * scale,
      fontWeight: "700",
      color: theme.buttonPrimary,
    },
  });