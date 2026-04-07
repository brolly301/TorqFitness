import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import AppSearchBar from "@/components/ui/AppSearchBar";
import ExerciseList from "@/components/exercises/ExerciseList";
import { useExerciseContext } from "@/context/ExerciseContext";
import { normalize } from "@/utils/helpers";
import AppWrapper from "@/components/ui/AppWrapper";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

export default function ExerciseScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const [search, setSearch] = useState<string>("");
  const { exercises } = useExerciseContext();

  const filteredExercises = exercises.filter(
    (exercise) =>
      normalize(exercise.name).includes(normalize(search)) &&
      !exercise.archived,
  );

  return (
    <AppWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={{ alignItems: "flex-end" }}
            hitSlop={10}
            onPress={() => router.navigate("/(tabs)/exercises/createExercise")}
          >
            <Feather name="plus" size={24} color={"black"} />
          </Pressable>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Exercises</Text>
          <Text style={styles.description}>
            Browse and manage your exercise library
          </Text>
        </View>
        <AppSearchBar setSearch={setSearch} />
        <ExerciseList showAddButton={false} exercises={filteredExercises} />
      </View>
    </AppWrapper>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      padding: 16 * scale,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 16,
      // marginTop: 40,
    },
    title: {
      fontSize: 26 * scale,
      fontWeight: "bold",
      marginBottom: 5,
    },
    description: {
      fontSize: 18 * scale,
      fontWeight: "400",
    },
    titleContainer: {
      padding: 16,
    },
  });
