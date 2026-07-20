import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Exercise } from "@/types/Global";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  exercise: Exercise | null;
};

export default function ChartsTab({ exercise }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Feather
          name="trending-up"
          size={24 * scale}
          color={theme.buttonPrimary}
        />
      </View>

      <Text style={styles.title}>Progress charts coming later</Text>

      <Text style={styles.description}>
        Your workout history is already being recorded. Charts will turn it
        into useful strength and performance trends.
      </Text>
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      paddingHorizontal: 22 * scale,
      paddingVertical: 30 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14 * scale,
    },

    iconContainer: {
      width: 50 * scale,
      height: 50 * scale,
      marginBottom: 15 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.buttonPrimary + "14",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "25",
      borderRadius: 15 * scale,
    },

    title: {
      marginBottom: 7 * scale,
      color: theme.text,
      fontSize: 17 * scale,
      fontWeight: "700",
      textAlign: "center",
    },

    description: {
      maxWidth: 280 * scale,
      color: theme.textSecondary,
      fontSize: 14 * scale,
      lineHeight: 20 * scale,
      textAlign: "center",
    },
  });