import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Exercise } from "@/types/Global";
import ExerciseItem from "./ExerciseItem";

type Props = {
  exercises: Exercise[];
};

export default function ExerciseList({ exercises }: Props) {
  return (
    <View>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <ExerciseItem exercise={item} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
