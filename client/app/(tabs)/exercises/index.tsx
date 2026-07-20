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
    const query = normalize(search);

    return exercises.filter((exercise) => {
      if (exercise.archived) return false;

      const searchableValues = [
        exercise.name,
        ...exercise.bodyParts,
        ...exercise.primaryMuscles,
        ...exercise.secondaryMuscles,
        ...exercise.equipment,
      ];

      return searchableValues.some((value) => normalize(value).includes(query));
    });
  }, [exercises, search]);

  return (
    <AppWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Exercises</Text>
            <Text style={styles.description}>Browse and manage exercises</Text>
          </View>

          <Pressable
            style={styles.addButton}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Create exercise"
            onPress={() => router.push("/(tabs)/exercises/createExercise")}
          >
            <Feather
              name="plus"
              size={20 * scale}
              color={theme.buttonPrimary}
            />
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <AppSearchBar setSearch={setSearch} search={search} />
        </View>

        <View style={styles.listContainer}>
          {filteredExercises.length > 0 ? (
            <ExerciseList showAddButton={false} exercises={filteredExercises} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderTitle}>
                {search.trim()
                  ? "No exercises found"
                  : "No exercises available"}
              </Text>

              <Text style={styles.placeholderText}>
                {search.trim()
                  ? `No exercises match "${search.trim()}"`
                  : "Create an exercise to get started"}
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
      paddingHorizontal: 16 * scale,
      paddingTop: 12 * scale,
      backgroundColor: theme.background,
    },

    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 18 * scale,
    },

    titleContainer: {
      flex: 1,
      marginRight: 16 * scale,
    },

    title: {
      marginBottom: 4 * scale,
      color: theme.text,
      fontSize: 32 * scale,
      fontWeight: "700",
    },

    description: {
      color: theme.textSecondary,
      fontSize: 16 * scale,
      fontWeight: "400",
      lineHeight: 22 * scale,
    },

    addButton: {
      width: 40 * scale,
      height: 40 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12 * scale,
    },

    searchContainer: {
      marginBottom: 14 * scale,
    },

    listContainer: {
      flex: 1,
    },

    placeholderContainer: {
      alignItems: "center",
      marginTop: 8 * scale,
      paddingHorizontal: 18 * scale,
      paddingVertical: 24 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16 * scale,
    },

    placeholderTitle: {
      marginBottom: 6 * scale,
      color: theme.text,
      fontSize: 16 * scale,
      fontWeight: "700",
    },

    placeholderText: {
      color: theme.textSecondary,
      fontSize: 14 * scale,
      textAlign: "center",
    },
  });
