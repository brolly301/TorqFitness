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

  const [search, setSearch] = useState("");
  const { exercises } = useExerciseContext();

  const filteredExercises = useMemo(() => {
    return exercises.filter(
      (exercise) =>
        normalize(exercise.name).includes(normalize(search)) &&
        !exercise.archived,
    );
  }, [exercises, search]);

  return (
    <AppWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.addButton}
            hitSlop={10}
            onPress={() => router.navigate("/(tabs)/exercises/createExercise")}
          >
            <Feather
              name="plus"
              size={20 * scale}
              color={theme.buttonPrimary}
            />
          </Pressable>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Exercises</Text>
          <Text style={styles.description}>
            Browse and manage your exercise library
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <AppSearchBar setSearch={setSearch} />
        </View>

        <View style={styles.listContainer}>
          <ExerciseList showAddButton={false} exercises={filteredExercises} />
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

    searchContainer: {
      marginBottom: 14 * scale,
    },

    listContainer: {
      flex: 1,
    },
  });
