import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Workout } from "@/types/Global";
import ActivityTile from "./ActivityTile";

type Props = {
  workouts: Workout[];
};

export default function ActivityList({ workouts }: Props) {
  return (
    <View>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <ActivityTile workout={item} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
