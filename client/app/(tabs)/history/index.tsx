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
        selectedColor: theme.buttonPrimary + "24",
selectedTextColor: theme.buttonPrimary,
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
  <View style={styles.titleContainer}>
    <Text style={styles.title}>History</Text>
    <Text style={styles.description}>
      Track your sessions. See your progress.
    </Text>
  </View>

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
         {activeTab === "activity" && selectedDate ? (
  <View style={styles.dateFilter}>
    <Feather
      name="calendar"
      size={14 * scale}
      color={theme.buttonPrimary}
    />

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
      style={styles.dateFilterClear}
      onPress={() => setSelectedDate(null)}
      accessibilityRole="button"
      accessibilityLabel="Clear date filter"
      hitSlop={8}
    >
      <Feather
        name="x"
        size={14 * scale}
        color={theme.buttonPrimary}
      />
    </Pressable>
  </View>
) : null}
          <View style={styles.contentContainer}>
            {activeTab === "activity" &&
              (displayedWorkouts.length > 0 ? (
                <ActivityList workouts={displayedWorkouts} />
              ) : (
               <View style={styles.placeholderContainer}>
  <View style={styles.placeholderIcon}>
    <Feather
      name={selectedDate ? "calendar" : "activity"}
      size={23 * scale}
      color={theme.buttonPrimary}
    />
  </View>

  <Text style={styles.placeholderTitle}>
    {selectedDate
      ? "No workouts on this date"
      : "No workouts yet"}
  </Text>

  <Text style={styles.placeholderText}>
    {selectedDate
      ? "Choose another date or clear the date filter"
      : "Complete your first workout to see it here"}
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
      fontSize: 32 * scale,
      fontWeight: "700",
      marginBottom: 4 * scale,
      color: theme.text,
    },

    description: {
      fontSize: 16 * scale,
      lineHeight: 22 * scale,
      fontWeight: "400",
      color: theme.textSecondary,
    },

    calendarButton: {
      width: 40 * scale,
      height: 40 * scale,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    tabContainer: {
      flexDirection: "row",
      gap: 4 * scale,
      padding: 4 * scale,
      marginBottom: 16 * scale,
      borderRadius: 14 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    tabButton: {
      flex: 1,
      minHeight: 40 * scale,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10 * scale,
      borderWidth: 1,
    },

    tabButtonActive: {
      backgroundColor: theme.buttonPrimary + "14",
      borderColor: theme.buttonPrimary + "35",
    },

    tabButtonInactive: {
      backgroundColor: "transparent",
      borderColor: "transparent",
    },

    tabButtonText: {
      fontSize: 14 * scale,
      fontWeight: "600",
    },

    tabButtonTextActive: {
      color: theme.buttonPrimary,
    },

    tabButtonTextInactive: {
      color: theme.textSecondary,
    },

    dateFilter: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 7 * scale,
      minHeight: 34 * scale,
      paddingLeft: 10 * scale,
      paddingRight: 5 * scale,
      marginBottom: 12 * scale,
      borderRadius: 999,
      backgroundColor: theme.buttonPrimary + "12",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "30",
    },

    dateFilterText: {
      fontSize: 13 * scale,
      fontWeight: "600",
      color: theme.buttonPrimary,
    },

    dateFilterClear: {
      width: 24 * scale,
      height: 24 * scale,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12 * scale,
      backgroundColor: theme.buttonPrimary + "12",
    },

    contentContainer: {
      flex: 1,
    },

    placeholderContainer: {
      alignItems: "center",
      marginTop: 8 * scale,
      paddingVertical: 30 * scale,
      paddingHorizontal: 22 * scale,
      borderRadius: 18 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    placeholderIcon: {
      width: 50 * scale,
      height: 50 * scale,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 15 * scale,
      borderRadius: 15 * scale,
      backgroundColor: theme.buttonPrimary + "14",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "25",
    },

    placeholderTitle: {
      fontSize: 18 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 7 * scale,
    },

    placeholderText: {
      maxWidth: 280 * scale,
      fontSize: 14 * scale,
      lineHeight: 20 * scale,
      color: theme.textSecondary,
      textAlign: "center",
    },
  });