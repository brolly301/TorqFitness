import { Exercise } from "@/types/Global";
import { Image } from "expo-image";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { capitalizeWords } from "@/utils/helpers";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  exercise: Exercise | null;
};

export default function DetailsTab({ exercise }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

const [isPlaying, setIsPlaying] = useState(false);

useEffect(() => {
  setIsPlaying(false);
}, [exercise?.id]);

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
  <Pressable
    style={styles.mediaContainer}
    onPress={() => setIsPlaying((current) => !current)}
    accessibilityRole="button"
    accessibilityLabel={isPlaying ? "Pause demonstration" : "Play demonstration"}
  >
    <Image
      style={styles.gif}
      source={exercise.gifUrl}
      contentFit="contain"
      autoplay={isPlaying}
    />

    {!isPlaying && (
      <View style={styles.playButton}>
        <Feather
          name="play"
          size={20 * scale}
          color="#FFFFFF"
        />
      </View>
    )}
  </Pressable>
) : (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>
      {exercise?.name?.charAt(0).toUpperCase() ?? "?"}
    </Text>
  </View>
)}

  <View style={styles.detailsGrid}>
    <View style={styles.detailCard}>
      <Text style={styles.detailLabel}>Primary Muscle</Text>
      <Text style={styles.detailValue} numberOfLines={2}>
        {primaryMuscle || "Not specified"}
      </Text>
    </View>

    <View style={styles.detailCard}>
      <Text style={styles.detailLabel}>Body Part</Text>
      <Text style={styles.detailValue} numberOfLines={2}>
        {bodyPart || "Not specified"}
      </Text>
    </View>

    <View style={styles.detailCard}>
      <Text style={styles.detailLabel}>Equipment</Text>
      <Text style={styles.detailValue} numberOfLines={2}>
        {equipment || "Not specified"}
      </Text>
    </View>

    <View style={styles.detailCard}>
      <Text style={styles.detailLabel}>Secondary Muscles</Text>
      <Text style={styles.detailValue} numberOfLines={2}>
        {secondaryMuscles || "None"}
      </Text>
    </View>
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
      marginBottom: 16 * scale,
    },

    mediaContainer: {
      width: "100%",
      height: 170 * scale,
      marginBottom: 14 * scale,
      overflow: "hidden",
      backgroundColor: "#FFFFFF",
      borderRadius: 14 * scale,
    },

    gif: {
      width: "100%",
      height: "100%",
    },

    playButton: {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: 46 * scale,
      height: 46 * scale,
      marginTop: -23 * scale,
      marginLeft: -23 * scale,
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: 3 * scale,
      backgroundColor: "#00000099",
      borderRadius: 23 * scale,
    },

    placeholder: {
      width: "100%",
      height: 170 * scale,
      marginBottom: 14 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.buttonPrimary + "12",
      borderWidth: 1,
      borderColor: theme.buttonPrimary + "25",
      borderRadius: 14 * scale,
    },

    placeholderText: {
      color: theme.buttonPrimary,
      fontSize: 40 * scale,
      fontWeight: "700",
    },

    detailsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8 * scale,
    },

    detailCard: {
      width: "48.5%",
      minHeight: 58 * scale,
      justifyContent: "center",
      paddingHorizontal: 10 * scale,
      paddingVertical: 8 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 11 * scale,
    },

    detailLabel: {
      marginBottom: 3 * scale,
      color: theme.textSecondary,
      fontSize: 11 * scale,
      fontWeight: "500",
    },

    detailValue: {
      color: theme.text,
      fontSize: 13 * scale,
      fontWeight: "600",
      lineHeight: 17 * scale,
    },

    instructionContainer: {
      padding: 14 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14 * scale,
    },

    heading: {
      marginBottom: 12 * scale,
      color: theme.text,
      fontSize: 16 * scale,
      fontWeight: "700",
    },

    instructionRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 10 * scale,
    },

    bullet: {
      width: 6 * scale,
      height: 6 * scale,
      marginTop: 7 * scale,
      marginRight: 10 * scale,
      backgroundColor: theme.buttonPrimary,
      borderRadius: 3 * scale,
    },

    instruction: {
      flex: 1,
      flexShrink: 1,
      color: theme.text,
      fontSize: 14 * scale,
      lineHeight: 21 * scale,
    },

    emptyText: {
      color: theme.textSecondary,
      fontSize: 14 * scale,
    },
  });