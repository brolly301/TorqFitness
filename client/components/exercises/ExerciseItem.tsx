import { StyleSheet, Text, View } from "react-native";
import React, { useMemo, useRef } from "react";
import { Exercise } from "@/types/Global";
import { Image } from "expo-image";
import { capitalizeWords } from "@/utils/helpers";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  exercise: Exercise;
};

export default function ExerciseItem({ exercise }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const expoImageRef = useRef<Image>(null);

  const bodyPart = capitalizeWords(exercise.bodyParts?.[0] ?? "Exercise");
  const primaryMuscle = capitalizeWords(
    exercise.primaryMuscles?.[0] ?? "Unknown muscle",
  );
  const secondaryMuscle = exercise.secondaryMuscles?.[0]
    ? capitalizeWords(exercise.secondaryMuscles[0])
    : "";

  return (
    <View style={styles.container}>
      <Image
        style={styles.gif}
        ref={expoImageRef}
        source={exercise.gifUrl}
        contentFit="contain"
        onLoad={() => {
          expoImageRef.current?.stopAnimating();
        }}
      />

      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {capitalizeWords(exercise.name)}
        </Text>

        <Text style={styles.bodyPart} numberOfLines={1}>
          {bodyPart}
        </Text>

        <Text style={styles.muscles} numberOfLines={1}>
          {primaryMuscle}
          {!!secondaryMuscle && (
            <Text style={styles.muscles}> & {secondaryMuscle}</Text>
          )}
        </Text>
      </View>
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12 * scale,
      backgroundColor: theme.card,
      borderRadius: 14 * scale,
      marginBottom: 10 * scale,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 4,
    },

    gif: {
      width: 64 * scale,
      height: 64 * scale,
      marginRight: 12 * scale,
      borderRadius: 10 * scale,
      backgroundColor: theme.buttonSecondary,
    },

    textContainer: {
      flex: 1,
      justifyContent: "center",
    },

    name: {
      fontSize: 17 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 4 * scale,
    },

    bodyPart: {
      fontSize: 14 * scale,
      color: theme.textSecondary,
      marginBottom: 2 * scale,
    },

    muscles: {
      fontSize: 14 * scale,
      color: theme.text,
    },
  });
