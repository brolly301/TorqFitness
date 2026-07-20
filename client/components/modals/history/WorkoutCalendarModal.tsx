import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import Feather from "@expo/vector-icons/Feather";
import AppModal from "@/components/ui/AppModal";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type CalendarMark = {
  marked?: boolean;
  dotColor?: string;
  selected?: boolean;
  selectedColor?: string;
  selectedTextColor?: string;
};

type Props = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDate: string | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
  markedDates: Record<string, CalendarMark>;
};

export default function WorkoutCalendarModal({
  modalVisible,
  setModalVisible,
  selectedDate,
  setSelectedDate,
  markedDates,
}: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <AppModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Filter by date</Text>
            <Text style={styles.description}>
              Choose a workout day
            </Text>
          </View>

          <Pressable
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Close calendar"
          >
            <Feather
              name="x"
              size={19 * scale}
              color={theme.text}
            />
          </Pressable>
        </View>

        <Calendar
          current={selectedDate ?? undefined}
          markedDates={markedDates}
          enableSwipeMonths
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            setModalVisible(false);
          }}
          style={styles.calendar}
          theme={{
            calendarBackground: theme.card,
            backgroundColor: theme.card,
            monthTextColor: theme.text,
            textSectionTitleColor: theme.textSecondary,
            dayTextColor: theme.text,
            textDisabledColor: theme.textMuted,
            todayTextColor: theme.buttonPrimary,
            selectedDayBackgroundColor: theme.buttonPrimary + "24",
            selectedDayTextColor: theme.buttonPrimary,
            arrowColor: theme.buttonPrimary,
            dotColor: theme.buttonPrimary,
            selectedDotColor: theme.buttonPrimary,
            textMonthFontWeight: "700",
            textDayHeaderFontWeight: "600",
            textDayFontWeight: "500",
            textMonthFontSize: 17 * scale,
            textDayFontSize: 14 * scale,
            textDayHeaderFontSize: 12 * scale,
          }}
        />
      </View>
    </AppModal>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      overflow: "hidden",
      padding: 16 * scale,
      borderRadius: 20 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },

    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 10 * scale,
    },

    headerText: {
      flex: 1,
      marginRight: 12 * scale,
    },

    title: {
      fontSize: 20 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 3 * scale,
    },

    description: {
      fontSize: 13 * scale,
      color: theme.textSecondary,
    },

    closeButton: {
      width: 34 * scale,
      height: 34 * scale,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10 * scale,
      backgroundColor: theme.buttonSecondary,
      borderWidth: 1,
      borderColor: theme.border,
    },

    calendar: {
      borderRadius: 14 * scale,
      backgroundColor: theme.card,
    },
  });