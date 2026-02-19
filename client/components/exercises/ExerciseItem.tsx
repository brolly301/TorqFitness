import { StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import { Exercise } from "@/types/Global";
import { Image } from "expo-image";
import { capitalizeWords } from "@/utils/helpers";

type Props = {
  exercise: Exercise;
};

export default function ExerciseItem({ exercise }: Props) {
  const expoImageRef = useRef<Image>(null);

  return (
    <View style={styles.container}>
      <Image
        style={styles.gif}
        ref={expoImageRef}
        source={exercise.gifUrl}
        onLoad={() => {
          expoImageRef.current?.stopAnimating();
        }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{capitalizeWords(exercise.name)}</Text>
        <Text style={styles.primaryMuscle}>{exercise.bodyParts[0]}</Text>
        <Text style={styles.primaryMuscle}>
          {exercise.primaryMuscles[0]} & {exercise.secondaryMuscles[1]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: "row",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
  },
  primaryMuscle: {
    fontSize: 14,
  },
  gif: {
    width: 65,
    height: 65,
  },
  textContainer: {},
});
