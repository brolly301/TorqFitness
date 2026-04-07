import { Pressable, StyleSheet, Text, View } from "react-native";
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
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function WorkoutScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { workouts } = useWorkoutContext();
  const { routines } = useRoutineContext();

  return (
    <AppWrapper>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Workouts</Text>
          <Text style={styles.description}>
            Start a workout or jump back into a routine
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}
          onPress={() => router.navigate("/(tabs)/workout/createWorkout")}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Start New Workout</Text>
            <FontAwesome
              style={{ opacity: 0.9 }}
              name="play-circle"
              size={16}
              color={theme.buttonPrimaryText}
            />
          </View>
        </Pressable>
        <View style={styles.sectionContainer}>
          <View style={styles.titleIcon}>
            <FontAwesome name="history" size={16} color={theme.text} />
            <Text style={styles.subTitle}>Previous Workouts</Text>
          </View>
          {workouts.length > 1 ? (
            workouts.map((workout) => {
              return <WorkoutTile key={workout.id} workout={workout} />;
            })
          ) : (
            <View>
              <Text style={styles.placeholderText}>No workouts yet</Text>
              <Text style={styles.placeholderText}>
                Start your first workout to see it here
              </Text>
            </View>
          )}
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.titleIcon}>
            <FontAwesome name="folder" size={16} color={theme.text} />

            <Text style={styles.subTitle}>My Routines</Text>
          </View>
          {routines.length > 1 ? (
            routines.map((routine) => {
              return <RoutineTile key={routine.id} routine={routine} />;
            })
          ) : (
            <View>
              <Text style={styles.placeholderText}>No routine yet</Text>
              <Text style={styles.placeholderText}>
                Add a new routine to see it here
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
    container: { padding: 16 * scale, backgroundColor: theme.background },
    subTitle: {
      fontSize: 20,
      fontWeight: "500",
      color: theme.text,
      // marginBottom: 12,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      // marginTop: 40,
      marginBottom: 30,
    },

    title: {
      fontSize: 36 * scale,
      fontWeight: "bold",
      marginBottom: 5,
      color: theme.text,
    },

    titleContainer: {
      padding: 16,
    },
    button: {
      backgroundColor: theme.buttonPrimary,
      paddingVertical: 16,
      borderRadius: 16,
      marginBottom: 25,
      alignItems: "center",
    },

    buttonContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    buttonText: {
      color: theme.buttonPrimaryText,
      fontSize: 17,
      fontWeight: "600",
    },
    sectionContainer: {
      marginBottom: 24,
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 10,
    },
    placeholderText: {
      fontSize: 15,
      fontWeight: "400",
    },
    description: {
      fontSize: 18 * scale,
      fontWeight: "400",
      color: theme.text,
    },
    titleIcon: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },
  });
