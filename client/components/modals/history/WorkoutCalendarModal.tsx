import React from "react";
import { Calendar } from "react-native-calendars";
import AppModal from "@/components/ui/AppModal";

type CalendarMark = {
  marked?: boolean;
  dotColor?: string;
  selected?: boolean;
  selectedColor?: string;
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
  return (
    <AppModal modalVisible={modalVisible} setModalVisible={setModalVisible}>
      <Calendar
        current={selectedDate ?? undefined}
        markedDates={markedDates}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          setModalVisible(false);
        }}
        enableSwipeMonths
      />
    </AppModal>
  );
}
