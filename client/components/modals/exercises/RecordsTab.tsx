import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Exercise } from "@/types/Global";

type Props = {
  exercise: Exercise | null;
};

export default function RecordsTab({ exercise }: Props) {
  return (
    <View>
      <Text>RecordsTab</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
