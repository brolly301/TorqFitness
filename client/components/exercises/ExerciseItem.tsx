import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { Exercise } from "@/types/Global";
import { Image } from "expo-image";
import { capitalizeWords } from "@/utils/helpers";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  exercise: Exercise;
};

export default function ExerciseItem({ exercise }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const bodyPart = capitalizeWords(exercise.bodyParts?.[0] ?? "Exercise");
  const primaryMuscle = capitalizeWords(
    exercise.primaryMuscles?.[0] ?? "Unknown muscle",
  );
  const secondaryMuscle = exercise.secondaryMuscles?.[0]
    ? capitalizeWords(exercise.secondaryMuscles[0])
    : "";

  const muscleText = secondaryMuscle
    ? `${primaryMuscle} & ${secondaryMuscle}`
    : primaryMuscle;

  const exerciseInitial = exercise.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <View style={styles.container}>
      {exercise.gifUrl ? (
        <Image
          style={styles.gif}
          source={exercise.gifUrl}
          autoplay={false}
          contentFit="contain"
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{exerciseInitial}</Text>
        </View>
      )}

      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {capitalizeWords(exercise.name)}
        </Text>

        <Text style={styles.bodyPart} numberOfLines={1}>
          {bodyPart}
        </Text>

        <Text style={styles.muscles} numberOfLines={1}>
          {muscleText}
        </Text>
      </View>
      <Feather
        name="chevron-right"
        size={18 * scale}
        color={theme.textSecondary}
      />
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10 * scale,
      padding: 12 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14 * scale,
      elevation: 3,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },

    gif: {
      width: 64 * scale,
      height: 64 * scale,
      marginRight: 12 * scale,
      backgroundColor: theme.buttonSecondary,
      borderRadius: 10 * scale,
    },

    placeholder: {
      width: 64 * scale,
      height: 64 * scale,
      marginRight: 12 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.buttonPrimary + "15",
      borderRadius: 12 * scale,
    },

    placeholderText: {
      color: theme.buttonPrimary,
      fontSize: 28 * scale,
      fontWeight: "700",
    },

    textContainer: {
      flex: 1,
      justifyContent: "center",
      marginRight: 8 * scale,
    },

    name: {
      marginBottom: 4 * scale,
      color: theme.text,
      fontSize: 17 * scale,
      fontWeight: "700",
    },

    bodyPart: {
      marginBottom: 2 * scale,
      color: theme.textSecondary,
      fontSize: 14 * scale,
    },

    muscles: {
      color: theme.text,
      fontSize: 14 * scale,
    },
  });
