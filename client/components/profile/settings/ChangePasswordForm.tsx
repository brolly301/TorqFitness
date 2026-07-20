import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useUserContext } from "@/context/UserContext";
import { Theme } from "@/types/Theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  changePasswordSchema,
  ChangePasswordFormValues,
} from "../../../utils/validation/authSchema";
import { router } from "expo-router";
import { FormField } from "@/types/Global";
import { toggleToast } from "@/utils/toggleToast";

export default function ChangePasswordForm() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { changePassword, error, setError } = useUserContext();

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
      router.back();
    } catch {
      // UserContext displays the API error toast.
    }
  };

  useEffect(() => {
    if (!error?.message) return;

    toggleToast({
      type: "error",
      text1: "Password Change Error.",
      text2: error.message,
    });

    setError(null);
  }, [error?.message]);

  const profileFields: FormField<ChangePasswordFormValues>[] = [
    {
      name: "currentPassword",
      placeholder: "Current Password",
      secureTextEntry: true,
    },
    {
      name: "newPassword",
      placeholder: "New Password",
      secureTextEntry: true,
    },
    {
      name: "confirmPassword",
      placeholder: "Confirm Password",
      secureTextEntry: true,
    },
  ];

  const isDisabled = !isValid || isSubmitting;

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
                {field.name === "newPassword" ? (
                  <Text style={styles.helperText}>
                    Use at least 8 characters with an uppercase letter,
                    lowercase letter, number, and special character.
                  </Text>
                ) : null}
                <TextInput
                  placeholder={field.placeholder}
                  onChangeText={onChange}
                  textAlignVertical="center"
                  value={value}
                  secureTextEntry
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
    {isSubmitting ? "Updating..." : "Update Password"}
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

    helperText: {
      marginTop: -2 * scale,
      marginBottom: 8 * scale,
      color: theme.textSecondary,
      fontSize: 12 * scale,
      lineHeight: 17 * scale,
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