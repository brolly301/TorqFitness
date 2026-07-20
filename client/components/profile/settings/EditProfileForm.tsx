import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useMemo } from "react";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useUserContext } from "@/context/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  UpdateProfileFormValues,
  updateProfileSchema,
} from "../../../utils/validation/authSchema";
import { FormField } from "@/types/Global";
import { toggleToast } from "@/utils/toggleToast";
import { router } from "expo-router";

export type UserInputType = {
  firstName: string;
  surname: string;
  email: string;
};

export default function EditProfileForm() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { user, updateUser, error, setError } = useUserContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty, isSubmitting },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      surname: user?.surname ?? "",
      email: user?.email ?? "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!user) return;

    reset({
      firstName: user.firstName,
      surname: user.surname,
      email: user.email,
    });
  }, [user, reset]);

  const onSubmit = async (data: UpdateProfileFormValues) => {
    try {
      await updateUser(data);
      router.back();
    } catch {
      // UserContext sets the error and the existing effect shows it.
      // Keep the form open.
    }
  };

  useEffect(() => {
    if (!error?.message) return;

    toggleToast({
      type: "error",
      text1: "Profile Update Error.",
      text2: error.message,
    });

    setError(null);
  }, [error?.message]);

  const profileFields: FormField<UpdateProfileFormValues>[] = [
    {
      name: "firstName",
      placeholder: "First Name",
    },
    {
      name: "surname",
      placeholder: "Surname",
    },
    {
      name: "email",
      placeholder: "Email",
    },
  ];

  const isDisabled = !isValid || !isDirty || isSubmitting;

  return (
    <View style={styles.container}>
      {profileFields.map((field) => {
        return (
          <Controller
            name={field.name}
            control={control}
            key={field.name}
            render={({ field: { onChange, value } }) => (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>{field.placeholder}</Text>
                <TextInput
                  placeholder={field.placeholder}
                  onChangeText={onChange}
                  textAlignVertical="center"
                  value={value}
                  placeholderTextColor={theme.textSecondary}
                  autoComplete="off"
                  textContentType="oneTimeCode"
                  importantForAutofill="no"
                  style={styles.input}
                />
              </View>
            )}
          />
        );
      })}
    <Pressable
  onPress={handleSubmit(onSubmit)}
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
    {isSubmitting ? "Saving..." : "Update Details"}
  </Text>
</Pressable>
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
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