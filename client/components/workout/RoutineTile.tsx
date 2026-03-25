import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Routine } from "@/types/Global";

type Props = {
  routine: Routine;
};

export default function RoutineTile({ routine }: Props) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.name}>{routine.name}</Text>
        <Text style={styles.date}>Last used - Monday, 10:39</Text>
      </View>
      <View>
        <Text style={styles.exercises}>
          {routine.exercises.length} exercises
        </Text>
        <Text style={styles.volume}>Chest, Triceps</Text>
      </View>
      <Feather name="arrow-right" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    fontWeight: "400",
  },
  exercises: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 10,
  },
  volume: {
    fontSize: 16,
    fontWeight: "400",
  },
});
