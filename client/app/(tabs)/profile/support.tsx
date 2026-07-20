import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import AppWrapper from "@/components/ui/AppWrapper";
import Feather from "@expo/vector-icons/Feather";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import { submitUserContactForm } from "@/api/settings";
import { useUserContext } from "@/context/UserContext";
import { toggleToast } from "@/utils/toggleToast";

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
  const { authToken, user } = useUserContext();

  const params = useLocalSearchParams<{ formType?: SupportFormType }>();
  const formType = params.formType ?? "contact";

  const content = supportContent[formType] ?? supportContent.contact;
  const [formData, setFormData] = useState<Record<SupportField, string>>({
    name: "",
    email: user?.email ?? "",
    subject: "",
    message: "",
    issue: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = content.fields.every(
    (field) => formData[field].trim().length > 0,
  );

  const isDisabled = !isFormValid || isSubmitting;

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
    if (isDisabled || !authToken.token) return;

    const payload = content.fields.reduce(
      (acc, field) => {
        acc[field] = formData[field].trim();
        return acc;
      },
      {} as Partial<Record<SupportField, string>>,
    );

    try {
      setIsSubmitting(true);

      await submitUserContactForm(formType, payload, authToken.token);

      toggleToast({
        type: "success",
        text1: "Submitted",
        text2: "Thanks — we’ve received your message.",
      });

      router.back();
    } catch (error) {
      toggleToast({
        type: "error",
        text1: "Submission failed",
        text2:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFields = (field: SupportField) => (
<View key={field} style={styles.fieldContainer}>
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
     <KeyboardAvoidingView
  style={styles.keyboardContainer}
  behavior={Platform.OS === "ios" ? "padding" : undefined}
>
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.contentContainer}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
  >
    <View style={styles.header}>
      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}
        onPress={() => router.back()}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Return to settings"
      >
        <Feather
          name="arrow-left"
          size={22 * scale}
          color={theme.text}
        />
      </Pressable>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.description}>
          {content.description}
        </Text>
      </View>
    </View>

    <View style={styles.formContainer}>
      {content.fields.map(renderFields)}

    <Pressable
  onPress={handleSubmit}
  disabled={isDisabled}
  style={({ pressed }) => [
    styles.button,
    isDisabled ? styles.buttonDisabled : styles.buttonEnabled,
    pressed && !isDisabled && styles.buttonPressed,
  ]}
>
  <Text
    style={[
      styles.buttonText,
      isDisabled
        ? styles.buttonDisabledText
        : styles.buttonEnabledText,
    ]}
  >
    {isSubmitting ? "Submitting..." : "Submit"}
  </Text>
</Pressable>
    </View>
  </ScrollView>
</KeyboardAvoidingView>
    </AppWrapper>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    keyboardContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },

    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    contentContainer: {
      flexGrow: 1,
      paddingTop: 12 * scale,
      paddingHorizontal: 16 * scale,
      paddingBottom: 28 * scale,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20 * scale,
    },

    backButton: {
      width: 40 * scale,
      height: 40 * scale,
      marginRight: 12 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12 * scale,
    },

    backButtonPressed: {
      opacity: 0.7,
    },

    titleContainer: {
      flex: 1,
    },

    title: {
      marginBottom: 2 * scale,
      color: theme.text,
      fontSize: 25 * scale,
      fontWeight: "700",
    },

    description: {
      color: theme.textSecondary,
      fontSize: 13 * scale,
      lineHeight: 18 * scale,
    },

    formContainer: {
      padding: 16 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14 * scale,
    },

    fieldContainer: {
      marginBottom: 14 * scale,
    },

    label: {
      marginBottom: 6 * scale,
      color: theme.textSecondary,
      fontSize: 13 * scale,
      fontWeight: "500",
    },

    input: {
      minHeight: 46 * scale,
      paddingHorizontal: 12 * scale,
      paddingVertical: 12 * scale,
      backgroundColor: theme.buttonSecondary,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: 12 * scale,
      color: theme.text,
      fontSize: 15 * scale,
    },

    messageInput: {
      minHeight: 120 * scale,
    },

    button: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 46 * scale,
      marginTop: 4 * scale,
      paddingHorizontal: 16 * scale,
      borderWidth: 1,
      borderRadius: 12 * scale,
    },

    buttonEnabled: {
      backgroundColor: theme.buttonPrimary + "14",
      borderColor: theme.buttonPrimary + "40",
    },

    buttonDisabled: {
      backgroundColor: theme.buttonDisabled,
      borderColor: theme.border,
    },

    buttonPressed: {
      opacity: 0.7,
    },

    buttonText: {
      fontSize: 15 * scale,
      fontWeight: "700",
    },

    buttonEnabledText: {
      color: theme.buttonPrimary,
    },

    buttonDisabledText: {
      color: theme.buttonDisabledText,
    },
  });