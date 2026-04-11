import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import ActivityList from "@/components/history/ActivityList";
import RecordsList from "@/components/history/RecordsList";
import { useWorkoutContext } from "@/context/WorkoutContext";
import AppWrapper from "@/components/ui/AppWrapper";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import Feather from "@expo/vector-icons/Feather";

type HistoryTab = "activity" | "records";

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<HistoryTab>("activity");
  const { workouts } = useWorkoutContext();

  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <AppWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.calendarButton} hitSlop={10}>
            <Feather
              name="calendar"
              size={20 * scale}
              color={theme.buttonPrimary}
            />
          </Pressable>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.description}>
            Track your sessions. See your progress.
          </Text>
        </View>

        <View style={styles.tabContainer}>
          <Pressable
            onPress={() => setActiveTab("activity")}
            style={[
              styles.tabButton,
              activeTab === "activity"
                ? styles.tabButtonActive
                : styles.tabButtonInactive,
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "activity"
                  ? styles.tabButtonTextActive
                  : styles.tabButtonTextInactive,
              ]}
            >
              Activity
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("records")}
            style={[
              styles.tabButton,
              activeTab === "records"
                ? styles.tabButtonActive
                : styles.tabButtonInactive,
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "records"
                  ? styles.tabButtonTextActive
                  : styles.tabButtonTextInactive,
              ]}
            >
              Records
            </Text>
          </Pressable>
        </View>

        <View style={styles.contentContainer}>
          {activeTab === "activity" ? (
            <ActivityList workouts={workouts} />
          ) : (
            <RecordsList />
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
      backgroundColor: theme.background,
      paddingHorizontal: 16 * scale,
      paddingTop: 12 * scale,
    },

    header: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginBottom: 12 * scale,
    },

    calendarButton: {
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

    tabContainer: {
      flexDirection: "row",
      gap: 10 * scale,
      marginBottom: 16 * scale,
    },

    tabButton: {
      flex: 1,
      borderRadius: 14 * scale,
      paddingVertical: 12 * scale,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
    },

    tabButtonActive: {
      backgroundColor: theme.buttonPrimary,
      borderColor: theme.buttonPrimary,
    },

    tabButtonInactive: {
      backgroundColor: theme.card,
      borderColor: theme.border,
    },

    tabButtonText: {
      fontSize: 15 * scale,
      fontWeight: "600",
    },

    tabButtonTextActive: {
      color: theme.buttonPrimaryText,
    },

    tabButtonTextInactive: {
      color: theme.text,
    },

    contentContainer: {
      flex: 1,
    },
  });
