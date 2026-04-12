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
          <Pressable
            style={styles.addButton}
            hitSlop={10}
            onPress={() => router.navigate("/(tabs)/routines/createRoutine")}
          >
            <Feather
              name="plus"
              size={20 * scale}
              color={theme.buttonPrimary}
            />
          </Pressable>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Routines</Text>
          <Text style={styles.description}>Plan. Save. Repeat.</Text>
        </View>

        <View style={styles.listContainer}>
          {routines.length > 0 ? (
            <RoutineList routines={routines} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderTitle}>No routines yet</Text>
              <Text style={styles.placeholderText}>
                Add a new routine to see it here
              </Text>
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
      backgroundColor: theme.background,
      paddingHorizontal: 16 * scale,
      paddingTop: 12 * scale,
    },

    header: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginBottom: 12 * scale,
    },

    addButton: {
      width: 40 * scale,
      height: 40 * scale,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 12 * scale,
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

    listContainer: {
      flex: 1,
    },

    placeholderContainer: {
      marginTop: 8 * scale,
      backgroundColor: theme.card,
      borderRadius: 16 * scale,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 24 * scale,
      paddingHorizontal: 18 * scale,
      alignItems: "center",
    },

    placeholderTitle: {
      fontSize: 16 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 6 * scale,
    },

    placeholderText: {
      fontSize: 14 * scale,
      color: theme.textSecondary,
      lineHeight: 20 * scale,
      textAlign: "center",
    },
  });
