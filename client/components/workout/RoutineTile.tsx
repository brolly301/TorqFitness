import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Routine } from "@/types/Global";
import { router } from "expo-router";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type Props = {
  routine: Routine;
};

export default function RoutineTile({ routine }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const loadRoutine = () => {
    router.navigate({
      pathname: "/workout/createWorkout",
      params: { routineId: routine.id },
    });
  };

  const exerciseCount = routine.exercises.length;
  const exerciseLabel = exerciseCount === 1 ? "exercise" : "exercises";

  return (
    <Pressable style={styles.container} onPress={loadRoutine}>
      <View style={styles.leftContent}>
        <Text style={styles.name} numberOfLines={1}>
          {routine.name}
        </Text>

        <Text style={styles.subText} numberOfLines={1}>
          Last used • Monday, 10:39
        </Text>
      </View>

      <View style={styles.rightContent}>
        <Text style={styles.meta} numberOfLines={1}>
          {exerciseCount} {exerciseLabel}
        </Text>

        <View style={styles.tagPill}>
          <Text style={styles.tagText}>Chest • Triceps</Text>
        </View>
      </View>

      <View style={styles.iconContainer}>
        <Feather
          name="arrow-right"
          size={18 * scale}
          color={theme.textSecondary}
        />
      </View>
    </Pressable>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 14 * scale,
      paddingVertical: 14 * scale,
      paddingHorizontal: 14 * scale,
      marginBottom: 12 * scale,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },

    leftContent: {
      flex: 1,
      marginRight: 12 * scale,
    },

    rightContent: {
      alignItems: "flex-end",
      marginRight: 10 * scale,
      maxWidth: "35%",
    },

    iconContainer: {
      width: 26 * scale,
      alignItems: "flex-end",
      justifyContent: "center",
    },

    name: {
      fontSize: 18 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 4 * scale,
    },

    subText: {
      fontSize: 14 * scale,
      color: theme.textSecondary,
    },

    meta: {
      fontSize: 15 * scale,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 4 * scale,
    },

    tagPill: {
      paddingHorizontal: 8 * scale,
      paddingVertical: 4 * scale,
      borderRadius: 999,
      backgroundColor: theme.buttonPrimary + "15",
    },

    tagText: {
      fontSize: 13 * scale,
      color: theme.buttonPrimary,
    },
  });
