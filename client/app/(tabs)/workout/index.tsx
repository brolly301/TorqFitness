import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import WorkoutTile from "@/components/workout/WorkoutTile";
import RoutineTile from "@/components/workout/RoutineTile";
import { router } from "expo-router";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { useRoutineContext } from "@/context/RoutineContext";
import AppWrapper from "@/components/ui/AppWrapper";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function WorkoutScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { workouts } = useWorkoutContext();
  const { routines } = useRoutineContext();

  const recentWorkouts = workouts.slice(0, 3);

  const recentRoutines = useMemo(() => {
    return [...routines]
      .sort((a, b) => {
        const aTime = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
        const bTime = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;

        return bTime - aTime;
      })
      .slice(0, 3);
  }, [routines]);

  return (
    <AppWrapper>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Workouts</Text>
          <Text style={styles.description}>
            Start a workout or jump back into a routine
          </Text>
        </View>

       <Pressable
  style={({ pressed }) => [
    styles.startCard,
    pressed && styles.buttonPressed,
  ]}
  onPress={() => router.push("/(tabs)/workout/createWorkout")}
>
  <View style={styles.startIconContainer}>
    <FontAwesome
      name="play"
      size={15 * scale}
      color={theme.buttonPrimary}
    />
  </View>

  <View style={styles.startTextContainer}>
    <Text style={styles.startTitle}>Start New Workout</Text>
    <Text style={styles.startDescription}>
      Begin an empty workout session
    </Text>
  </View>

  <FontAwesome
    name="chevron-right"
    size={13 * scale}
    color={theme.textSecondary}
  />
</Pressable>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleIcon}>
              <FontAwesome
                name="history"
                size={16 * scale}
                color={theme.text}
              />
              <Text style={styles.subTitle}>Previous Workouts</Text>
            </View>

            {workouts.length > 0 && (
              <Pressable onPress={() => router.navigate("/history")}>
                <Text style={styles.sectionLink}>View all</Text>
              </Pressable>
            )}
          </View>

          {recentWorkouts.length > 0 ? (
            recentWorkouts.map((workout) => (
              <WorkoutTile key={workout.id} workout={workout} />
            ))
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderTitle}>No workouts yet</Text>
              <Text style={styles.placeholderText}>
                Start your first workout to see it here
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleIcon}>
              <FontAwesome name="folder" size={16 * scale} color={theme.text} />
              <Text style={styles.subTitle}>My Routines</Text>
            </View>

            {routines.length > 0 && (
              <Pressable onPress={() => router.navigate("/routines")}>
                <Text style={styles.sectionLink}>View all</Text>
              </Pressable>
            )}
          </View>

          {recentRoutines.length > 0 ? (
            recentRoutines.map((routine) => (
              <RoutineTile key={routine.id} routine={routine} />
            ))
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderTitle}>No routines yet</Text>
              <Text style={styles.placeholderText}>
                Add a new routine to see it here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </AppWrapper>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 20,
      backgroundColor: theme.background,
    },

    contentContainer: {
      flexGrow: 1,
      padding: 16 * scale,
    },

    titleContainer: {
      marginBottom: 16 * scale,
    },

    title: {
      marginBottom: 4 * scale,
      color: theme.text,
      fontSize: 34 * scale,
      fontWeight: "700",
    },

    description: {
      color: theme.textSecondary,
      fontSize: 16 * scale,
      fontWeight: "400",
      lineHeight: 22 * scale,
    },

    startCard: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 28 * scale,
      padding: 14 * scale,
      backgroundColor: theme.buttonPrimary + "12",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "35",
      borderRadius: 16 * scale,
    },

    buttonPressed: {
      opacity: 0.75,
    },

    startIconContainer: {
      width: 42 * scale,
      height: 42 * scale,
      marginRight: 12 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.buttonPrimary + "18",
      borderRadius: 13 * scale,
    },

    startTextContainer: {
      flex: 1,
    },

    startTitle: {
      marginBottom: 3 * scale,
      color: theme.text,
      fontSize: 16 * scale,
      fontWeight: "600",
    },

    startDescription: {
      color: theme.textSecondary,
      fontSize: 13 * scale,
      lineHeight: 18 * scale,
    },

    sectionContainer: {
      marginBottom: 26 * scale,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12 * scale,
      paddingHorizontal: 2 * scale,
    },

    titleIcon: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8 * scale,
    },

    subTitle: {
      color: theme.text,
      fontSize: 19 * scale,
      fontWeight: "600",
    },

    sectionLink: {
      color: theme.buttonPrimary,
      fontSize: 14 * scale,
      fontWeight: "600",
    },

    placeholderContainer: {
      padding: 18 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16 * scale,
    },

    placeholderTitle: {
      marginBottom: 4 * scale,
      color: theme.text,
      fontSize: 15 * scale,
      fontWeight: "600",
    },

    placeholderText: {
      color: theme.textSecondary,
      fontSize: 14 * scale,
      fontWeight: "400",
      lineHeight: 20 * scale,
    },
  });