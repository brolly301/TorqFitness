import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Workout } from "@/types/Global";
import { Button } from "@react-navigation/elements";
import ActivityList from "@/components/history/ActivityList";
import RecordsList from "@/components/history/RecordsList";
import { useWorkoutContext } from "@/context/WorkoutContext";

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<string>("activity");
  const { workouts } = useWorkoutContext();

  return (
    <View>
      <View style={styles.buttonContainer}>
        <Button onPressIn={() => setActiveTab("activity")}>Activity</Button>
        <Button onPressIn={() => setActiveTab("records")}>PRs</Button>
      </View>
      {activeTab === "activity" ? (
        <ActivityList workouts={workouts} />
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
