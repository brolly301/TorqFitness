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

  return (
    <View style={styles.container}>
      <Image
        style={styles.gif}
        ref={expoImageRef}
        source={exercise.gifUrl}
        onLoad={() => {
          expoImageRef.current?.stopAnimating();
        }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{capitalizeWords(exercise.name)}</Text>
        <Text style={styles.primaryMuscle}>
          {capitalizeWords(exercise.bodyParts[0])}
        </Text>
        <Text style={styles.primaryMuscle}>
          {capitalizeWords(exercise.primaryMuscles[0])}
          {exercise.secondaryMuscles?.[0] && (
            <Text> & {capitalizeWords(exercise.secondaryMuscles[0])}</Text>
          )}
        </Text>
      </View>
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      padding: 10 * scale,
      backgroundColor: theme.card,
      borderRadius: 10 * scale,
      marginVertical: 5 * scale,
      flexDirection: "row",
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 6,
    },
    name: {
      fontSize: 20 * scale,
      fontWeight: "600",
      marginBottom: 5 * scale,
    },
    primaryMuscle: {
      fontSize: 14 * scale,
    },
    gif: {
      width: 65,
      height: 65,
      marginRight: 10,
    },
    textContainer: {},
  });
