import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Exercise } from "@/types/Global";

type Props = {
  exercise: Exercise | null;
};

export default function ChartsTab({ exercise }: Props) {
  return (
    <View>
      <Text>ChartsTab</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
