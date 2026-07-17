import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import ActivityList from "@/components/history/ActivityList";
import RecordsList from "@/components/history/RecordsList";
import { useWorkoutContext } from "@/context/WorkoutContext";
import AppWrapper from "@/components/ui/AppWrapper";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import Feather from "@expo/vector-icons/Feather";
import { getLocalDateKey } from "@/utils/helpers";
import WorkoutCalendarModal from "@/components/modals/history/WorkoutCalendarModal";

type HistoryTab = "activity" | "records";

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<HistoryTab>("activity");
  const { workouts } = useWorkoutContext();

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const markedDates = useMemo(() => {
    const dates: Record<string, object> = {};

    workouts.forEach((workout) => {
      if (!workout.startedAt) return;

      const dateKey = getLocalDateKey(workout.startedAt);

      dates[dateKey] = {
        marked: true,
        dotColor: theme.buttonPrimary,
      };
    });

    if (selectedDate) {
      dates[selectedDate] = {
        ...dates[selectedDate],
        selected: true,
        selectedColor: theme.buttonPrimary,
      };
    }

    return dates;
  }, [workouts, selectedDate, theme.buttonPrimary]);

  useEffect(() => {
    if (selectedDate) {
      setActiveTab("activity");
    }
  }, [selectedDate]);

  const displayedWorkouts = useMemo(() => {
    if (!selectedDate) return workouts;

    return workouts.filter(
      (workout) =>
        workout.startedAt &&
        getLocalDateKey(workout.startedAt) === selectedDate,
    );
  }, [workouts, selectedDate]);

  return (
    <>
      <WorkoutCalendarModal
        modalVisible={calendarVisible}
        setModalVisible={setCalendarVisible}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        markedDates={markedDates}
      />
      <AppWrapper>
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable
              style={styles.calendarButton}
              hitSlop={10}
              onPress={() => setCalendarVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Filter workouts by date"
            >
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
          {activeTab === "activity" && selectedDate && (
            <View style={styles.dateFilter}>
              <Text style={styles.dateFilterText}>
                {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                  undefined,
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </Text>

              <Pressable
                onPress={() => setSelectedDate(null)}
                accessibilityRole="button"
                accessibilityLabel="Clear date filter"
                hitSlop={10}
              >
                <Feather name="x" size={18 * scale} color={theme.text} />
              </Pressable>
            </View>
          )}
          <View style={styles.contentContainer}>
            {activeTab === "activity" &&
              (displayedWorkouts.length > 0 ? (
                <ActivityList workouts={displayedWorkouts} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.placeholderTitle}>
                    {selectedDate
                      ? "No workouts on this date"
                      : "No workouts yet"}
                  </Text>

                  <Text style={styles.placeholderText}>
                    {selectedDate
                      ? "Choose another date or clear the date filter"
                      : "Start your first workout to see it here"}
                  </Text>
                </View>
              ))}
            {activeTab === "records" && <RecordsList workouts={workouts} />}
          </View>
        </View>
      </AppWrapper>
    </>
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

    placeholderContainer: {
      marginTop: 8 * scale,
      backgroundColor: theme.card,
      borderRadius: 16 * scale,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 24 * scale,
      paddingHorizontal: 18 * scale,
      alignItems: "center",
    },

    placeholderTitle: {
      fontSize: 16 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 6 * scale,
    },

    placeholderText: {
      fontSize: 14 * scale,
      color: theme.textSecondary,
      lineHeight: 20 * scale,
      textAlign: "center",
    },
    dateFilter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12 * scale,
      paddingHorizontal: 14 * scale,
      paddingVertical: 10 * scale,
      marginBottom: 12 * scale,
    },

    dateFilterText: {
      fontSize: 14 * scale,
      fontWeight: "600",
      color: theme.text,
    },
  });
