import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Routine } from "@/types/Global";
import RoutineTile from "./RoutineTile";

type Props = {
  routines: Routine[];
};

export default function RoutineList({ routines }: Props) {
  return (
    <View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={routines}
        maxToRenderPerBatch={5}
        initialNumToRender={8}
        windowSize={5}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <RoutineTile routine={item} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
