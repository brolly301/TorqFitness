import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { Exercise } from "@/types/Global";
import { Image } from "expo-image";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { capitalizeWords } from "@/utils/helpers";

type Props = {
  exercise: Exercise | null;
};

export default function DetailsTab({ exercise }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const instructions = exercise?.instructions ?? [];

  const primaryMuscle = capitalizeWords(exercise?.primaryMuscles?.[0] ?? "");
  const bodyPart = capitalizeWords(exercise?.bodyParts?.[0] ?? "");
  const equipment = capitalizeWords(exercise?.equipment?.[0] ?? "");
  const secondaryMuscles = exercise?.secondaryMuscles?.length
    ? exercise.secondaryMuscles
        .map((muscle) => capitalizeWords(muscle))
        .join(", ")
    : "";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topSection}>
        {exercise?.gifUrl ? (
          <Image
            style={styles.gif}
            source={exercise.gifUrl}
            contentFit="contain"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              {exercise?.name?.charAt(0).toUpperCase() ?? "?"}
            </Text>
          </View>
        )}

        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Primary Muscle</Text>
          <Text style={styles.detailValue}>{primaryMuscle}</Text>

          {!!secondaryMuscles && (
            <>
              <Text style={styles.detailLabel}>Secondary Muscle</Text>
              <Text style={styles.detailValue}>{secondaryMuscles}</Text>
            </>
          )}
          <Text style={styles.detailLabel}>Body Part</Text>
          <Text style={styles.detailValue}>{bodyPart}</Text>

          <Text style={styles.detailLabel}>Equipment</Text>
          <Text style={styles.detailValue}>{equipment}</Text>
        </View>
      </View>

      <View style={styles.instructionContainer}>
        <Text style={styles.heading}>Instructions</Text>

        {instructions.length > 0 ? (
          instructions.map((item, index) => (
            <View key={`${item}-${index}`} style={styles.instructionRow}>
              <View style={styles.bullet} />
              <Text style={styles.instruction}>{item}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No instructions available yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    contentContainer: {
      paddingBottom: 16 * scale,
    },

    topSection: {
      flexDirection: "row",
      alignItems: "stretch",
      marginBottom: 16 * scale,
    },

    gif: {
      width: 120 * scale,
      borderRadius: 12 * scale,
      backgroundColor: theme.card,
      marginRight: 12 * scale,
    },

    placeholder: {
      width: 120 * scale,
      borderRadius: 12 * scale,
      backgroundColor: theme.buttonPrimary + "15",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12 * scale,
    },

    placeholderText: {
      fontSize: 40 * scale,
      fontWeight: "700",
      color: theme.buttonPrimary,
      marginBottom: 6 * scale,
    },

    detailsContainer: {
      flex: 1,
      justifyContent: "center",
    },

    detailLabel: {
      fontSize: 12 * scale,
      color: theme.textSecondary,
      marginBottom: 2 * scale,
    },

    detailValue: {
      fontSize: 14 * scale,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 10 * scale,
    },

    instructionContainer: {
      backgroundColor: theme.card,
      borderRadius: 14 * scale,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 14 * scale,
    },

    heading: {
      fontSize: 16 * scale,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 12 * scale,
    },

    instructionRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 10 * scale,
    },

    bullet: {
      width: 6 * scale,
      height: 6 * scale,
      borderRadius: 3 * scale,
      backgroundColor: theme.buttonPrimary,
      marginTop: 7 * scale,
      marginRight: 10 * scale,
    },

    instruction: {
      flex: 1,
      fontSize: 14 * scale,
      lineHeight: 21 * scale,
      color: theme.text,
      flexShrink: 1,
    },

    emptyText: {
      fontSize: 14 * scale,
      color: theme.textSecondary,
    },
  });
