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
  const recentRoutines = routines.slice(0, 3);

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
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.navigate("/(tabs)/workout/createWorkout")}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Start New Workout</Text>
            <FontAwesome
              name="play-circle"
              size={16 * scale}
              color={theme.buttonPrimaryText}
              style={styles.buttonIcon}
            />
          </View>
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
      backgroundColor: theme.background,
      flex: 1,
      marginTop: 20,
    },

    contentContainer: {
      padding: 16 * scale,
      flexGrow: 1,
    },

    titleContainer: {
      marginBottom: 16 * scale,
    },

    title: {
      fontSize: 34 * scale,
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

    button: {
      backgroundColor: theme.buttonPrimary,
      paddingVertical: 15 * scale,
      borderRadius: 16 * scale,
      marginBottom: 24 * scale,
      alignItems: "center",
    },

    buttonPressed: {
      opacity: 0.92,
    },

    buttonContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8 * scale,
    },

    buttonIcon: {
      opacity: 0.95,
    },

    buttonText: {
      color: theme.buttonPrimaryText,
      fontSize: 17 * scale,
      fontWeight: "600",
    },

    sectionContainer: {
      marginBottom: 20 * scale,
      backgroundColor: theme.card,
      padding: 14 * scale,
      borderRadius: 16 * scale,
      borderWidth: 1,
      borderColor: theme.border,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12 * scale,
    },

    titleIcon: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8 * scale,
    },

    subTitle: {
      fontSize: 19 * scale,
      fontWeight: "600",
      color: theme.text,
    },

    sectionLink: {
      fontSize: 14 * scale,
      fontWeight: "600",
      color: theme.buttonPrimary,
    },

    placeholderContainer: {
      paddingVertical: 8 * scale,
    },

    placeholderTitle: {
      fontSize: 15 * scale,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 4 * scale,
    },

    placeholderText: {
      fontSize: 14 * scale,
      fontWeight: "400",
      color: theme.textSecondary,
      lineHeight: 20 * scale,
    },
  });
