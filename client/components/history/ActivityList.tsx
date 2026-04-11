import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import { Workout } from "@/types/Global";
import ActivityTile from "./ActivityTile";

type Props = {
  workouts: Workout[];
};

export default function ActivityList({ workouts }: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityTile workout={item} />}
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
});
