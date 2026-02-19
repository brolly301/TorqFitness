import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Exercise } from "@/types/Global";
import { Image } from "expo-image";

type Props = {
  exercise: Exercise | null;
};

export default function DetailsTab({ exercise }: Props) {
  return (
    <View style={styles.container}>
      <Image style={styles.gif} source={exercise?.gifUrl} />
      <View style={styles.instructionContainer}>
        <Text style={styles.heading}>Instructions </Text>
        <FlatList
          data={exercise?.instructions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            return <Text style={styles.instruction}>{item}</Text>;
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  heading: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  gif: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  instructionContainer: {},
  instruction: {
    marginBottom: 10,
  },
});
