import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import * as crypto from "expo-crypto";
import { Exercise } from "@/types/Global";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import ExerciseForm from "@/components/exercises/ExerciseForm";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import AppWrapper from "@/components/ui/AppWrapper";

export default function CreateExerciseScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const [exercise, setExercise] = useState<Exercise>({
    id: crypto.randomUUID(),
    name: "",
    primaryMuscles: [],
    instructions: [],
    secondaryMuscles: [],
    bodyParts: [],
    equipment: [],
    userCreated: true,
  });

  return (
    <AppWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
  <Pressable
    style={({ pressed }) => [
      styles.backButton,
      pressed && styles.backButtonPressed,
    ]}
    onPress={() => router.back()}
    hitSlop={10}
    accessibilityRole="button"
    accessibilityLabel="Go back"
  >
    <Feather
      name="arrow-left"
      size={22 * scale}
      color={theme.text}
    />
  </Pressable>

  <View style={styles.titleContainer}>
    <Text style={styles.title}>Create Exercise</Text>

    <Text style={styles.description}>
      Add a custom movement to your library
    </Text>
  </View>
</View>

        <View style={styles.formContainer}>
          <ExerciseForm exercise={exercise} setExercise={setExercise} />
        </View>
      </ScrollView>
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

    formContainer: {
      flex: 1,
      paddingBottom: 24 * scale,
    },
  });