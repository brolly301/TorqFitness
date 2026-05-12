import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useLayoutEffect, useMemo } from "react";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/utils/validation/authSchema";
import AppError from "@/components/ui/AppError";
import { useUserContext } from "@/context/UserContext";
import { useNavigation } from "expo-router";

export default function ResetPasswordScreen() {
  const { theme, scale, themeType } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const { error, setError, requestResetCode } = useUserContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const navigation = useNavigation();

  useLayoutEffect(() => {
    setError(null);
  }, [navigation]);

  const onSubmit = (data: ResetPasswordFormValues) => {
    const { email } = data;
    requestResetCode(email);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Please enter your email below.</Text>
      <Controller
        name="email"
        key="email"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              placeholder="Email"
              placeholderTextColor={"black"}
              onChangeText={onChange}
              textAlignVertical="center"
              value={value}
              autoComplete="off"
              textContentType="oneTimeCode"
              importantForAutofill="no"
              style={styles.input}
            />
          </>
        )}
      />
      {errors.email && <AppError>{errors.email?.message}</AppError>}
      {error?.message && <AppError>{error.message}</AppError>}
      <Pressable
        style={styles.buttonContainer}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      flex: 1,
      paddingTop: 80,
      paddingHorizontal: 30,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      marginBottom: 10,
      alignSelf: "flex-start",
      color: theme.text,
    },
    subtitle: {
      color: theme.text,
      fontSize: 15,
      marginBottom: 40,
      alignSelf: "flex-start",
    },
    input: {
      borderWidth: 1,
      backgroundColor: theme.inputBg,
      borderColor: theme.inputBorder,
      padding: 13,
      marginVertical: 8,
      fontSize: 16,
      borderRadius: 12,
      color: theme.text,
    },
    buttonContainer: {
      backgroundColor: theme.buttonPrimary,
      borderRadius: 12,
      paddingVertical: 11,
      paddingHorizontal: 16,
      width: "100%",
      marginVertical: 10,
      alignItems: "center",
    },
    buttonText: {
      textAlign: "center",
      color: theme.buttonPrimaryText,
      fontWeight: "600",
      letterSpacing: 0.5,
      fontSize: 18,
    },
  });
