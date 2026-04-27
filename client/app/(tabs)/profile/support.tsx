import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import AppWrapper from "@/components/ui/AppWrapper";
import Feather from "@expo/vector-icons/Feather";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import { submitUserContactForm } from "@/api/settings";
import { useUserContext } from "@/context/UserContext";

export type SupportFormType = "contact" | "report" | "feedback";
export type SupportField = "name" | "email" | "subject" | "message" | "issue";
const supportContent: Record<
  SupportFormType,
  { title: string; description: string; fields: SupportField[] }
> = {
  contact: {
    title: "Contact Us",
    description: "Send us a message",
    fields: ["email", "subject", "message"],
  },
  report: {
    title: "Report Issue",
    description: "Fill out the details below to report an issue",
    fields: ["email", "issue", "message"],
  },
  feedback: {
    title: "Feedback",
    description: "Let us know what you think",
    fields: ["message"],
  },
};

export default function SupportScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const { authToken } = useUserContext();

  const params = useLocalSearchParams<{ formType?: SupportFormType }>();
  const formType = params.formType ?? "contact";

  const content = supportContent[formType] ?? supportContent.contact;
  const [formData, setFormData] = useState<Record<SupportField, string>>({
    name: "",
    email: "",
    subject: "",
    message: "",
    issue: "",
  });

  const handleChange = (field: SupportField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fieldLabels: Record<SupportField, string> = {
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    issue: "Issue",
  };

  const handleSubmit = async () => {
    const payload = content.fields.reduce(
      (acc, field) => {
        acc[field] = formData[field];
        return acc;
      },
      {} as Partial<Record<SupportField, string>>,
    );
    await submitUserContactForm(formType, payload, authToken.token);
  };

  const renderFields = (field: SupportField) => (
    <View key={field} style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{fieldLabels[field]}</Text>

      <TextInput
        placeholder={fieldLabels[field]}
        style={[styles.input, field === "message" && styles.messageInput]}
        placeholderTextColor={theme.textSecondary}
        value={formData[field] ?? ""}
        onChangeText={(value) => handleChange(field, value)}
        multiline={field === "message"}
        textAlignVertical={field === "message" ? "top" : "center"}
        keyboardType={field === "email" ? "email-address" : "default"}
        autoCapitalize={field === "email" ? "none" : "sentences"}
      />
    </View>
  );
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
        <View style={{ flex: 1 }}>
          {content.fields.map(renderFields)}
          <Pressable style={[styles.button]} onPress={handleSubmit}>
            <Text style={[styles.buttonText]}>Submit</Text>
          </Pressable>
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

    label: {
      fontSize: 13 * scale,
      color: theme.textSecondary,
      marginBottom: 6 * scale,
    },

    input: {
      borderRadius: 12 * scale,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      paddingHorizontal: 12 * scale,
      paddingVertical: 12 * scale,
      backgroundColor: theme.buttonSecondary,
      marginBottom: 5 * scale,
      fontSize: 15 * scale,
      color: theme.text,
    },
    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12 * scale,
      paddingVertical: 12 * scale,
      marginTop: 10 * scale,
      backgroundColor: theme.buttonPrimary,
    },

    buttonText: {
      fontSize: 15 * scale,
      fontWeight: "700",
      color: theme.buttonPrimaryText,
    },
    messageInput: {
      minHeight: 120 * scale,
    },
  });
