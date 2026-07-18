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
              <View style={{ marginBottom: 10 }}>
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
                  placeholderTextColor={theme.text}
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
        style={[
          styles.button,
          {
            backgroundColor: isDisabled
              ? theme.buttonDisabled
              : theme.buttonPrimary,
          },
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color: theme.buttonPrimaryText,
            },
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
      paddingVertical: 20,
      backgroundColor: theme.surface,
      borderRadius: 14 * scale,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 4,
    },
    helperText: {
      fontSize: 12 * scale,
      color: theme.textSecondary,
      marginTop: -2 * scale,
      marginBottom: 8 * scale,
    },
    label: {
      fontSize: 14 * scale,
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
      fontSize: 15 * scale,
      marginBottom: 5 * scale,
      color: theme.text,
    },

    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12 * scale,
      paddingVertical: 12 * scale,
      marginTop: 10 * scale,
    },

    buttonText: {
      fontSize: 15 * scale,
      fontWeight: "700",
    },
  });
