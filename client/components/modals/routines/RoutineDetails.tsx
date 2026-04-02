import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useRef } from "react";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { capitalizeWords } from "@/utils/helpers";
import { router } from "expo-router";
import { Routine } from "@/types/Global";
import exercises from "../../../constants/exercises.json";
import { useRoutineContext } from "@/context/RoutineContext";
import { Image } from "expo-image";

type Props = {
  routine: Routine;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RoutineDetails({ routine, setModalVisible }: Props) {
  const { deleteRoutine } = useRoutineContext();

  const expoImageRef = useRef<Image>(null);

  const exerciseList = routine.exercises.map((rtEx) => {
    const details = exercises.find(
      (exercise) => exercise.id === rtEx.exerciseId,
    );
    return { ...rtEx, details };
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <EvilIcons
          name="trash"
          size={40}
          color={"red"}
          onPress={() => {
            deleteRoutine(routine.id);
          }}
        />
        <Text style={styles.name}>{routine.name}</Text>
        <EvilIcons
          name="pencil"
          size={40}
          color={"black"}
          onPress={() => {
            router.navigate({
              pathname: "/(tabs)/routines/editRoutine",
              params: { routineId: routine.id },
            });
            setModalVisible(false);
          }}
        />
      </View>
      <FlatList
        data={exerciseList}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => {
          return (
            <View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  Summary
                </Text>
                <Text>{routine.description}</Text>
                <Text>{routine.exercises.length} Exercise</Text>
              </View>
              <Text>Exercises</Text>
            </View>
          );
        }}
        renderItem={({ item }) => {
          return (
            <View key={item.id} style={styles.routineContainer}>
              <View style={styles.nameButtonContainer}>
                <Text style={styles.exerciseName}>
                  {capitalizeWords(item.details?.name ?? "")}
                </Text>
                <Text style={styles.exerciseName}>
                  {capitalizeWords(item.details?.bodyParts[0] ?? "")}
                </Text>
                <Text style={styles.exerciseName}>
                  {capitalizeWords(item.details?.primaryMuscles[0] ?? "")} &{" "}
                  {capitalizeWords(item.details?.secondaryMuscles[0] ?? "")}
                </Text>
                <Image
                  style={styles.gif}
                  ref={expoImageRef}
                  source={item.details?.gifUrl}
                  onLoad={() => {
                    expoImageRef.current?.stopAnimating();
                  }}
                />
              </View>
              {item.sets.map((set) => {
                return (
                  <View>
                    <Text>{item.sets.length} Sets</Text>
                  </View>
                );
              })}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  routineContainer: {
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },

  nameButtonContainer: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  gif: {
    width: 65,
    height: 65,
  },
});
