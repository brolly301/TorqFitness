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
    bodyParts: [],
    equipment: [],
    userCreated: true,
  });

  return (
    <AppWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={10}
          >
            <Feather name="arrow-left" size={22 * scale} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create Exercise</Text>
          <Text style={styles.description}>
            Add the details for your new exercise below
          </Text>
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
      justifyContent: "flex-start",
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

    formContainer: {
      flex: 1,
    },
  });
