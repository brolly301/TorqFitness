import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormValues,
  loginSchema,
} from "../../../utils/validation/authSchema";
import type { FormField } from "@/types/Global";
import AppError from "@/components/ui/AppError";
import { useUserContext } from "@/context/UserContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import { router, useNavigation } from "expo-router";
import { Image } from "expo-image";
import { SectionType } from "@/app/(auth)";
import EvilIcons from "@expo/vector-icons/EvilIcons";

type Props = {
  setSection: (section: SectionType) => void;
};

export default function LoginSection({ setSection }: Props) {
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
        onPress={() => setSection("resetPassword")}
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
        onPress={() => setSection("signUp")}
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
      borderRadius: 12 * scale,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      paddingHorizontal: 12 * scale,
      paddingVertical: 12 * scale,
      backgroundColor: theme.buttonSecondary,
      marginBottom: 10 * scale,
      fontSize: 15 * scale,
      color: theme.text,
    },

    container: {},

    title: {
      fontSize: 32,
      fontWeight: "700",
      marginBottom: 10,
      alignSelf: "flex-start",
      color: "white",
    },

    subtitle: {
      color: "white",
      fontSize: 15,
      marginBottom: 40,
      alignSelf: "flex-start",
    },
    buttonContainer: {
      backgroundColor: "rgba(40, 25, 60, 0.8)",
      borderColor: "rgba(180, 140, 255, 0.25)",
      borderWidth: 2,
      borderRadius: 12,
      paddingVertical: 12,

      width: "100%",
      marginVertical: 8,
      alignItems: "center",
    },
    buttonText: {
      color: "#F4EEFF",
      fontWeight: "600",
      letterSpacing: 2,
      fontSize: 14,
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
