import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import AppWrapper from "@/components/ui/AppWrapper";
import Feather from "@expo/vector-icons/Feather";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type SupportFormType = "contact" | "report" | "feedback";

const supportContent: Record<
  SupportFormType,
  { title: string; description: string }
> = {
  contact: {
    title: "Contact Us",
    description: "Send us a message",
  },
  report: {
    title: "Report Issue",
    description: "Fill out the details below to report an issue",
  },
  feedback: {
    title: "Feedback",
    description: "Let us know what you think",
  },
};

export default function SupportScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const params = useLocalSearchParams<{ formType?: SupportFormType }>();
  const formType = params.formType ?? "contact";

  const content = supportContent[formType] ?? supportContent.contact;

  return (
    <AppWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={10}
          >
            <Feather name="arrow-left" size={22 * scale} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.description}>{content.description}</Text>
        </View>
      </View>
    </AppWrapper>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16 * scale,
      paddingTop: 12 * scale,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginBottom: 12 * scale,
    },

    backButton: {
      width: 40 * scale,
      height: 40 * scale,
      borderRadius: 12 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    titleContainer: {
      marginBottom: 18 * scale,
    },

    title: {
      fontSize: 32 * scale,
      fontWeight: "700",
      marginBottom: 4 * scale,
      color: theme.text,
    },

    description: {
      fontSize: 16 * scale,
      fontWeight: "400",
      color: theme.textSecondary,
      lineHeight: 22 * scale,
    },
  });
