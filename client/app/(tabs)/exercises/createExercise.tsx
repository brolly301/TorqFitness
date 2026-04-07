import { Pressable, StyleSheet, Text, View } from "react-native";
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={{ flexDirection: "row", paddingLeft: 16 }}
            onPress={() => router.back()}
            hitSlop={10}
          >
            <Feather name="arrow-left" size={24} color={"black"} />
          </Pressable>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create Exercise</Text>
          <Text style={styles.description}>
            Add the details for your new exercise below
          </Text>
        </View>
        <ExerciseForm exercise={exercise} setExercise={setExercise} />
      </View>
    </AppWrapper>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: { padding: 16 * scale, backgroundColor: theme.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      // marginTop: 40,
      marginBottom: 30,
    },

    title: {
      fontSize: 26 * scale,
      fontWeight: "bold",
      marginBottom: 5,
      color: theme.text,
    },
    description: {
      fontSize: 18 * scale,
      fontWeight: "400",
      color: theme.text,
    },
    titleContainer: {
      padding: 16,
    },
  });
