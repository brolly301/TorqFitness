import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Routine } from "@/types/Global";
import Feather from "@expo/vector-icons/Feather";
import RoutineDetailsModal from "../modals/routines/RoutineDetailsModal";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  routine: Routine;
};

export default function RoutineTile({ routine }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <>
      <RoutineDetailsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        routine={routine}
      />
      <Pressable style={styles.container} onPress={() => setModalVisible(true)}>
        <View>
          <Text style={styles.name}>{routine.name}</Text>
          <Text style={styles.date}>Last used - Monday, 10:39</Text>
        </View>
        <View>
          <Text style={styles.exercises}>
            {routine.exercises.length} exercises
          </Text>
          <Text style={styles.volume}>Chest, Triceps</Text>
        </View>
        <Feather name="arrow-right" />
      </Pressable>
    </>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.background,
      padding: 10 * scale,
      borderRadius: 10,
      marginBottom: 10 * scale,
    },
    name: {
      fontSize: 18 * scale,
      fontWeight: "600",
      marginBottom: 10 * scale,
    },
    date: {
      fontSize: 14 * scale,
      fontWeight: "400",
    },
    exercises: {
      fontSize: 16 * scale,
      fontWeight: "400",
      marginBottom: 10 * scale,
    },
    volume: {
      fontSize: 16 * scale,
      fontWeight: "400",
    },
  });
