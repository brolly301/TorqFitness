import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { Exercise } from "@/types/Global";
import { Image } from "expo-image";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  exercise: Exercise | null;
};

export default function DetailsTab({ exercise }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
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

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {},
    heading: {
      fontSize: 16 * scale,
      fontWeight: "500",
      marginBottom: 10 * scale,
    },
    gif: {
      width: 200,
      height: 200,
      alignSelf: "center",
    },
    instructionContainer: {},
    instruction: {
      marginBottom: 10 * scale,
    },
  });
