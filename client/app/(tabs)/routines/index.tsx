import { StyleSheet, Text, View } from "react-native";
import React from "react";
import RoutineList from "@/components/routines/RoutineList";
import { useRoutineContext } from "@/context/RoutineContext";

export default function RoutineScreen() {
  const { routines } = useRoutineContext();

  return (
    <View>
      <RoutineList routines={routines} />
    </View>
  );
}

const styles = StyleSheet.create({});
