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

  const totalSets = routine.exercises.reduce(
    (total, ex) => total + ex.sets.length,
    0,
  );

  return (
    <>
      <RoutineDetailsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        routine={routine}
      />
      <Pressable style={styles.container} onPress={() => setModalVisible(true)}>
        <View style={styles.highlight} />

        <View style={styles.contentContainer}>
          <View style={styles.routineTopDetails}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{routine.name}</Text>
              <Text style={styles.volume}>Chest • Triceps</Text>
            </View>

            <Feather
              name="arrow-right"
              size={18 * scale}
              color={theme.textSecondary}
            />
          </View>
          <View style={styles.hr} />
          <View style={styles.routineBottomDetails}>
            <Text style={styles.meta}>
              {routine.exercises.length} exercises • {totalSets} sets
            </Text>

            <Text style={styles.date}>Last used Mon 10:39</Text>
          </View>
        </View>
      </Pressable>
    </>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: theme.card,
      borderRadius: 12,
      marginBottom: 10 * scale,
      overflow: "hidden",
    },

    highlight: {
      backgroundColor: theme.buttonPrimary,
      width: 6,
    },

    contentContainer: {
      flex: 1,
      padding: 12 * scale,
    },

    routineTopDetails: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    name: {
      fontSize: 18 * scale,
      fontWeight: "600",
      marginBottom: 2 * scale,
    },

    volume: {
      fontSize: 14 * scale,
      color: theme.textSecondary,
    },

    routineBottomDetails: {
      // marginTop: 8 * scale,
    },

    meta: {
      fontSize: 14 * scale,
      color: theme.textSecondary,
    },

    date: {
      fontSize: 13 * scale,
      color: theme.textSecondary,
      marginTop: 2 * scale,
    },
    hr: {
      height: 1,
      width: "100%",
      backgroundColor: theme.border,
      marginVertical: 5,
    },
  });
