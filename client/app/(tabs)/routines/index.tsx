import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import RoutineList from "@/components/routines/RoutineList";
import { useRoutineContext } from "@/context/RoutineContext";
import AppWrapper from "@/components/ui/AppWrapper";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

export default function RoutineScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { routines } = useRoutineContext();

  return (
    <AppWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={{ alignItems: "flex-end" }}
            hitSlop={10}
            onPress={() => router.navigate("/(tabs)/routines/createRoutine")}
          >
            <View style={styles.iconContainer}>
              <Feather name="plus" size={20} color={theme.buttonPrimary} />
            </View>
          </Pressable>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Routines</Text>
          <Text style={styles.description}>Plan. Save. Repeat.</Text>
        </View>
        <RoutineList routines={routines} />
      </View>
    </AppWrapper>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      padding: 16 * scale,
      backgroundColor: theme.background,
      // flex: 1,
    },
    header: {
      // marginTop: 40,
    },
    title: {
      fontSize: 26 * scale,
      fontWeight: "bold",
      marginBottom: 5,
    },
    description: {
      fontSize: 18 * scale,
      fontWeight: "400",
    },
    titleContainer: {
      padding: 16,
    },
    iconContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 8,
      backgroundColor: theme.border,
      borderRadius: 10,
    },
  });
