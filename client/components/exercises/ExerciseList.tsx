import { FlatList, Pressable, StyleSheet, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Exercise } from "@/types/Global";
import ExerciseItem from "./ExerciseItem";
import ExerciseDetailsModal from "../modals/exercises/ExerciseDetailsModal";

type Props = {
  exercises: Exercise[];
  handleAddExercise?: (exerciseId: string) => void;
  showAddButton?: boolean;
};

export default function ExerciseList({
  showAddButton = true,
  exercises,
  handleAddExercise,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [exercise, setExercise] = useState<Exercise | null>(null);

  const selectedExercise = useMemo(() => exercise, [exercise]);

  return (
    <>
      <ExerciseDetailsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        exercise={selectedExercise}
        handleAddExercise={handleAddExercise}
        showAddButton={showAddButton}
      />

      <View style={styles.container}>
        <FlatList
          data={exercises}
          maxToRenderPerBatch={5}
          initialNumToRender={8}
          windowSize={5}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
           <Pressable
  style={({ pressed }) => pressed && styles.itemPressed}
  onPress={() => {
    setExercise(item);
    setModalVisible(true);
  }}
>
              <ExerciseItem exercise={item} />
            </Pressable>
          )}
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    flex: 1,
  },

  contentContainer: {
    paddingTop: 4,
    paddingBottom: 24,
  },

  itemPressed: {
    opacity: 0.7,
  },
});