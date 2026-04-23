import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useLayoutEffect, useMemo, useState } from "react";
import LoginForm from "@/components/auth/login/LoginForm";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormValues,
  loginSchema,
} from "../../utils/validation/authSchema";
import type { FormField } from "@/types/Global";
import AppError from "@/components/ui/AppError";
import { Button } from "@react-navigation/elements";
import { useUserContext } from "@/context/UserContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import { router, useNavigation } from "expo-router";

export default function LoginScreen() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const { login, error, setError } = useUserContext();

  const navigation = useNavigation();
  const loginFields: FormField<LoginFormValues>[] = [
    { name: "email", placeholder: "Email" },
    { name: "password", placeholder: "Password", secureTextEntry: true },
  ];

  useLayoutEffect(() => {
    setError(null);
  }, [navigation]);

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Torq</Text>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Your progress starts where you left off
      </Text>
      {loginFields.map((field) => {
        return (
          <Controller
            name={field.name}
            control={control}
            key={field.name}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  placeholder={field.placeholder}
                  placeholderTextColor={"black"}
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                  textAlignVertical="center"
                  secureTextEntry={field.secureTextEntry}
                />
                {errors[field.name] && (
                  <AppError>{errors[field.name]?.message}</AppError>
                )}
              </>
            )}
          />
        );
      })}
      {error?.message && <AppError>{error.message}</AppError>}
      <Pressable
        onPress={() => router.push("/(auth)/resetPassword")}
        style={styles.resetLinkWrapper}
      >
        <Text style={styles.forgotPassword}>
          Forgot Password?<Text style={styles.forgotLink}> Reset it</Text>
        </Text>
      </Pressable>
      <Pressable
        style={styles.buttonContainer}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable
        onPress={() => router.replace("/(auth)/signUp")}
        style={styles.signUpWrapper}
      >
        <Text style={styles.switchText}>
          Don't have an account?<Text style={styles.link}> Sign Up</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: theme.inputBorder,
      padding: 13,
      backgroundColor: theme.inputBg,
      marginVertical: 8,
      fontSize: 16,
      borderRadius: 12,
      color: theme.text,
    },
    container: {
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
    switchText: {
      color: "#999",
      fontSize: 14,
      textAlign: "center",
    },

    link: {
      color: theme.text,
      fontWeight: "600",
    },
    forgotPassword: {
      color: "#888",
      fontSize: 14,
      textAlign: "right",
    },
    forgotLink: {
      color: theme.textSecondary,
      fontWeight: "500",
    },
    resetLinkWrapper: {
      marginTop: 6,
      marginBottom: 14,
    },
    signUpWrapper: {
      marginTop: 20,
    },
  });
