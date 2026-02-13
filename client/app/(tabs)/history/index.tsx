import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Workout } from "@/types/Global";
import { Button } from "@react-navigation/elements";
import ActivityList from "@/components/history/ActivityList";
import RecordsList from "@/components/history/RecordsList";

export const workoutHistory: Workout[] = [
  {
    id: "w001",
    name: "Full Body Strength",
    description: "Heavy compound focus.",
    date: "2026-02-12",
    startTime: "18:02",
    endTime: "19:05",
    exercises: [
      {
        exerciseId: "ex001",
        sets: [
          { weight: 120, reps: 5 },
          { weight: 120, reps: 5 },
          { weight: 125, reps: 4 },
        ],
      },
      {
        exerciseId: "ex002",
        sets: [
          { weight: 90, reps: 6 },
          { weight: 90, reps: 6 },
          { weight: 95, reps: 4 },
        ],
      },
      {
        exerciseId: "ex003",
        sets: [{ reps: 12 }, { reps: 10 }, { reps: 9 }],
      },
    ],
    notes: "Bench felt strong. Squat depth solid.",
  },

  {
    id: "w002",
    name: "Upper Pump",
    date: "2026-02-10",
    startTime: "17:40",
    endTime: "18:30",
    exercises: [
      {
        exerciseId: "ex002",
        sets: [
          { weight: 80, reps: 10 },
          { weight: 80, reps: 10 },
          { weight: 85, reps: 8 },
        ],
      },
      {
        exerciseId: "ex006",
        sets: [
          { weight: 12, reps: 15 },
          { weight: 12, reps: 15 },
          { weight: 14, reps: 12 },
        ],
      },
      {
        exerciseId: "ex007",
        sets: [
          { weight: 35, reps: 15 },
          { weight: 40, reps: 12 },
          { weight: 40, reps: 12 },
        ],
      },
    ],
  },

  {
    id: "w003",
    name: "Leg Day",
    date: "2026-02-08",
    startTime: "16:10",
    endTime: "17:15",
    exercises: [
      {
        exerciseId: "ex001",
        sets: [
          { weight: 130, reps: 5 },
          { weight: 130, reps: 5 },
          { weight: 135, reps: 3 },
        ],
      },
      {
        exerciseId: "ex005",
        sets: [
          { weight: 110, reps: 8 },
          { weight: 110, reps: 8 },
          { weight: 115, reps: 6 },
        ],
      },
      {
        exerciseId: "ex008",
        sets: [
          { weight: 240, reps: 12 },
          { weight: 260, reps: 10 },
          { weight: 260, reps: 10 },
        ],
      },
    ],
    notes: "Hamstrings tight but good session.",
  },

  {
    id: "w004",
    name: "Back Focus",
    date: "2026-02-06",
    startTime: "18:20",
    endTime: "19:10",
    exercises: [
      {
        exerciseId: "ex003",
        sets: [{ reps: 14 }, { reps: 12 }, { reps: 10 }],
      },
      {
        exerciseId: "ex004",
        sets: [
          { weight: 90, reps: 10 },
          { weight: 95, reps: 8 },
          { weight: 95, reps: 8 },
        ],
      },
      {
        exerciseId: "ex009",
        sets: [
          { weight: 70, reps: 12 },
          { weight: 75, reps: 10 },
          { weight: 75, reps: 10 },
        ],
      },
    ],
  },

  {
    id: "w005",
    name: "Arms & Accessories",
    date: "2026-02-04",
    startTime: "17:55",
    endTime: "18:35",
    exercises: [
      {
        exerciseId: "ex010",
        sets: [
          { weight: 16, reps: 12 },
          { weight: 18, reps: 10 },
          { weight: 18, reps: 10 },
        ],
      },
      {
        exerciseId: "ex007",
        sets: [
          { weight: 35, reps: 15 },
          { weight: 40, reps: 12 },
          { weight: 45, reps: 10 },
        ],
      },
      {
        exerciseId: "ex006",
        sets: [
          { weight: 12, reps: 15 },
          { weight: 14, reps: 12 },
          { weight: 14, reps: 12 },
        ],
      },
    ],
    notes: "Quick pump session before rest day.",
  },
];

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<string>("activity");

  return (
    <View>
      <View style={styles.buttonContainer}>
        <Button onPressIn={() => setActiveTab("activity")}>Activity</Button>
        <Button onPressIn={() => setActiveTab("records")}>PRs</Button>
      </View>
      {activeTab === "activity" ? (
        <ActivityList workouts={workoutHistory} />
      ) : (
        <RecordsList />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
  },
});
