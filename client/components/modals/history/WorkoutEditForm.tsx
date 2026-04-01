import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Workout } from "@/types/Global";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import exercises from "../../../constants/exercises.json";
import { useWorkoutContext } from "@/context/WorkoutContext";
import { Button } from "@react-navigation/elements";
import { addSet, removeExercise, updateSet } from "@/utils/workoutUtil";
import { capitalizeWords } from "@/utils/helpers";
import { router } from "expo-router";

type Props = {
  workout: Workout;
  setActiveEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function WorkoutEditForm({ workout, setActiveEdit }: Props) {
  const [formData, setFormData] = useState<Workout>(workout);

  const { updateWorkout } = useWorkoutContext();

  const handleSubmit = () => {
    updateWorkout(formData);
    setActiveEdit(false);
  };

  const exerciseList = formData.exercises.map((we) => {
    const details = exercises.find((ex) => ex.id === we.exerciseId);

    return { ...we, details };
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <EvilIcons
          name="check"
          size={40}
          color={"green"}
          onPress={handleSubmit}
        />
        <EvilIcons
          name="arrow-left"
          size={40}
          color={"red"}
          onPress={() => setActiveEdit(false)}
        />
      </View>
      <View style={styles.contentContainer}>
        <TextInput
          style={styles.input}
          value={formData.name}
          placeholderTextColor={"black"}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, name: text }))
          }
        />
        <TextInput
          style={styles.input}
          value={formData.description}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, description: text }))
          }
        />
        <TextInput
          style={styles.input}
          value={formData.notes}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, notes: text }))
          }
        />
        <FlatList
          data={exerciseList}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => {
            return (
              <View>
                <Text>{workout.name}</Text>
                <Text>{workout.description}</Text>
                <Text>{workout.notes}</Text>
              </View>
            );
          }}
          renderItem={({ item }) => {
            return (
              <View key={item.id} style={styles.workoutContainer}>
                <View style={styles.nameButtonContainer}>
                  <Text style={styles.exerciseName}>
                    {capitalizeWords(item.details?.name ?? "")}
                  </Text>
                  <EvilIcons
                    onPress={() => removeExercise(setFormData, item.id)}
                    name="trash"
                    size={30}
                    color={"red"}
                  />
                </View>
                <View style={styles.headerContainer}>
                  <View style={styles.exerciseInputContainer}>
                    <Text>Set</Text>
                  </View>
                  <View style={styles.exerciseInputContainer}>
                    <Text>Reps</Text>
                  </View>
                  <View style={styles.exerciseInputContainer}>
                    <Text>Weight</Text>
                  </View>
                </View>
                {item.sets.map((set) => {
                  return (
                    <View key={set.id} style={styles.exerciseContainer}>
                      <View style={styles.exerciseInputContainer}>
                        <TextInput
                          placeholder={set.order.toString()}
                          placeholderTextColor={"black"}
                          style={styles.nameInput}
                        />
                      </View>
                      <View style={styles.exerciseInputContainer}>
                        <TextInput
                          placeholder={set.reps.toString()}
                          placeholderTextColor={"black"}
                          onChangeText={(text) =>
                            updateSet(
                              setFormData,
                              item.id,
                              set.id,
                              "reps",
                              parseInt(text),
                            )
                          }
                          style={styles.nameInput}
                        />
                      </View>
                      <View style={styles.exerciseInputContainer}>
                        <TextInput
                          placeholder={set.weight?.toString()}
                          placeholderTextColor={"black"}
                          onChangeText={(text) =>
                            updateSet(
                              setFormData,
                              item.id,
                              set.id,
                              "weight",
                              parseInt(text),
                            )
                          }
                          style={styles.nameInput}
                        />
                      </View>
                    </View>
                  );
                })}

                <Button onPressIn={() => addSet(setFormData, item.id)}>
                  Add set
                </Button>
              </View>
            );
          }}
        />
        <Button
          onPress={() =>
            router.push({
              pathname: "../../(modals)/exercise",
              params: { target: "workout" },
            })
          }
        >
          Add Exercise
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    marginBottom: 10,
  },
  nameInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  workoutContainer: {
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  exerciseInputContainer: {
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    marginBottom: 10,
  },
  exerciseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    gap: 8,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    gap: 8,
  },
  nameButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
