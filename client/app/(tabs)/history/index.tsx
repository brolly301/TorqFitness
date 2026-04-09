import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Workout } from "@/types/Global";
import { Button } from "@react-navigation/elements";
import ActivityList from "@/components/history/ActivityList";
import RecordsList from "@/components/history/RecordsList";
import { useWorkoutContext } from "@/context/WorkoutContext";
import AppWrapper from "@/components/ui/AppWrapper";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import Feather from "@expo/vector-icons/Feather";

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<string>("activity");
  const { workouts } = useWorkoutContext();

  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <AppWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={{ alignItems: "flex-end" }} hitSlop={10}>
            <View style={styles.iconContainer}>
              <Feather name="calendar" size={20} color={theme.buttonPrimary} />
            </View>
          </Pressable>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.description}>
            Track your sessions. See your progress.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => setActiveTab("activity")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Activity</Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("records")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Records</Text>
          </Pressable>
        </View>
        {activeTab === "activity" ? (
          <ActivityList workouts={workouts} />
        ) : (
          <RecordsList />
        )}
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
    iconContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 8,
      backgroundColor: theme.border,
      borderRadius: 10,
    },

    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      backgroundColor: theme.buttonPrimary,
      paddingVertical: 10 * scale,
      width: "49%",
    },
    buttonText: {
      fontSize: 14 * scale,
      fontWeight: "bold",
      color: theme.buttonPrimaryText,
    },
  });
