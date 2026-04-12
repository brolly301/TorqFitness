import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { Workout } from "@/types/Global";
import ActivityTile from "./ActivityTile";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type Props = {
  workouts: Workout[];
};

export default function ActivityList({ workouts }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityTile workout={item} />}
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    list: {
      flex: 1,
    },
    contentContainer: {
      paddingBottom: 32,
    },
  });
