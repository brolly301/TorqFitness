import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useUserContext } from "@/context/UserContext";
import { Theme } from "@/types/Theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  changePasswordSchema,
  ChnagePasswordFormValues,
} from "../../../../server/src/validation/changePasswordSchema";
import { useNavigation } from "expo-router";
import { FormField } from "@/types/Global";
import AppError from "@/components/ui/AppError";

export default function ChangePasswordForm() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { changePassword, error, setError } = useUserContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChnagePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: ChnagePasswordFormValues) => {
    const { confirmPassword, password } = data;

    if (data.password !== confirmPassword) return;

    changePassword(password);
  };

  const navigation = useNavigation();

  useLayoutEffect(() => {
    setError(null);
  }, [navigation]);

  const profileFields: FormField<ChnagePasswordFormValues>[] = [
    {
      name: "password",
      placeholder: "Password",
      secureTextEntry: true,
    },
    {
      name: "confirmPassword",
      placeholder: "Confirm Password",
      secureTextEntry: true,
    },
  ];

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
                {errors[field.name] && (
                  <AppError>{errors[field.name]?.message}</AppError>
                )}
              </View>
            )}
          />
        );
      })}
      {error?.message && <AppError>{error.message}</AppError>}
      <Pressable
        onPress={handleSubmit(onSubmit)}
        // disabled={isDisabled}
        style={[
          styles.button,
          {
            backgroundColor:
              // isDisabled
              //   ?
              //    theme.buttonDisabled
              //   :
              theme.buttonPrimary,
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
          Update Password
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
