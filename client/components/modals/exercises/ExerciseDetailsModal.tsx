import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Button } from "@react-navigation/elements";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Exercise, ModalProps, WorkoutExercise } from "@/types/Global";
import DetailsTab from "./DetailsTab";
import ChartsTab from "./ChartsTab";
import RecordsTab from "./RecordsTab";
import HistoryTab from "./HistoryTab";
import { capitalizeWords } from "@/utils/helpers";
import { router, usePathname } from "expo-router";
import * as crypto from "expo-crypto";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { useRoutineContext } from "@/context/RoutineContext";

type Props = ModalProps & {
  exercise: Exercise | null;
  target: "workout" | "routine";
};

type TabName = "Details" | "Records" | "History" | "Charts";

export default function ExerciseDetailsModal({
  modalVisible,
  setModalVisible,
  exercise,
  target,
}: Props) {
  const [tab, setTab] = useState<TabName>("Details");
  const tabName: TabName[] = ["Details", "History", "Records", "Charts"];

  const renderTab = () => {
    switch (tab) {
      case "Details":
        return <DetailsTab exercise={exercise} />;
      case "History":
        return <HistoryTab exercise={exercise} />;
      case "Records":
        return <RecordsTab exercise={exercise} />;
      case "Charts":
        return <ChartsTab exercise={exercise} />;
      default:
        return null;
    }
  };

  const { setWorkout } = useWorkoutContext();
  const { setRoutine } = useRoutineContext();

  const handleSubmit = () => {
    if (!exercise) return;

    const newExercise = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      order: 1,
      sets: [{ id: crypto.randomUUID(), order: 1, reps: 0, weight: null }],
      notes: "",
    };

    if (target === "workout") {
      setWorkout((prev) => ({
        ...prev,
        exercises: [
          ...prev.exercises,
          {
            ...newExercise,
            order: prev.exercises.length + 1,
          },
        ],
      }));
    } else {
      setRoutine((prev) => ({
        ...prev,
        exercises: [
          ...prev.exercises,
          {
            ...newExercise,
            order: prev.exercises.length + 1,
          },
        ],
      }));
    }

    router.back();
  };

  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.modalView}>
          <View style={styles.iconContainer}>
            <EvilIcons
              name="close"
              size={22}
              color={"black"}
              onPress={() => setModalVisible(!modalVisible)}
            />
            <Pressable style={styles.addButton} onPress={handleSubmit}>
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>
          <Text style={styles.exercise}>
            {exercise?.name ? capitalizeWords(exercise?.name) : ""}
          </Text>
          <View style={styles.tabRowContainer}>
            {tabName.map((tab) => {
              return (
                <Pressable
                  key={tab}
                  style={styles.tab}
                  onPress={() => setTab(tab)}
                >
                  <Text style={styles.tabLabel}>{tab}</Text>
                </Pressable>
              );
            })}
          </View>
          <>{renderTab()}</>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    width: "89%",
    height: "60%",
    borderRadius: 12,
    backgroundColor: "white",
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 26,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  exercise: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
  },
  tabRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#8cec7f",
    marginHorizontal: 4,
  },
  tabLabel: {
    color: "#fff",
    fontWeight: "700",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#7facec",
    marginHorizontal: 4,
  },
  addButtonText: {
    color: "white",
  },
});
