import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormValues,
  loginSchema,
} from "../../../utils/validation/authSchema";
import type { FormField } from "@/types/Global";
import { useUserContext } from "@/context/UserContext";
import { useAppTheme } from "@/hooks/useAppTheme";

import { SectionType } from "@/app/(auth)";
import { toggleToast } from "@/utils/toggleToast";

type Props = {
  setSection: (section: SectionType) => void;
};

export default function LoginSection({ setSection }: Props) {
  const { scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(scale), [scale]);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const { login, error, setError } = useUserContext();

  const loginFields: FormField<LoginFormValues>[] = [
    { name: "email", placeholder: "Email" },
    { name: "password", placeholder: "Password", secureTextEntry: true },
  ];

  useEffect(() => {
    if (!error?.message) return;

    toggleToast({
      type: "error",
      text1: "Login Error.",
      text2: error.message,
    });

    setError(null);
  }, [error?.message]);

  const onSubmit = async (data: LoginFormValues) => {
    if (loading) return;
    try {
      setLoading(true);
      await login(data);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !isValid;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>

      <Text style={styles.subtitle}>
        Continue building on the progress you’ve already made.
      </Text>

      <View style={styles.form}>
        {loginFields.map((field) => (
          <Controller
            name={field.name}
            control={control}
            key={field.name}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{field.placeholder}</Text>

                <TextInput
                  placeholder={field.placeholder}
                  placeholderTextColor="rgba(255,255,255,0.38)"
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                  textAlignVertical="center"
                  secureTextEntry={field.secureTextEntry}
                  keyboardType={
                    field.name === "email" ? "email-address" : "default"
                  }
                  autoCapitalize={field.name === "email" ? "none" : "sentences"}
                  autoCorrect={false}
                />
              </View>
            )}
          />
        ))}

        <Pressable
          onPress={() => setSection("resetPassword")}
          style={({ pressed }) => [
            styles.resetLinkWrapper,
            pressed && styles.linkPressed,
          ]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Reset forgotten password"
        >
          <Text style={styles.forgotLink}>Forgot password?</Text>
        </Pressable>

        <Pressable
          disabled={isDisabled}
          style={({ pressed }) => [
            styles.buttonContainer,
            isDisabled && styles.buttonDisabled,
            pressed && !isDisabled && styles.buttonPressed,
          ]}
          onPress={handleSubmit(onSubmit)}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </Pressable>

        <View style={styles.signUpRow}>
          <Text style={styles.switchText}>Don’t have an account?</Text>

          <Pressable
            onPress={() => setSection("signUp")}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Create an account"
          >
            <Text style={styles.link}>Sign up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const makeStyles = (scale: number) =>
  StyleSheet.create({
    container: {
      width: "100%",
      maxWidth: 420,
      alignSelf: "center",
    },

    title: {
      marginBottom: 7 * scale,
      color: "#FFFFFF",
      fontSize: 30 * scale,
      fontWeight: "700",
    },

    subtitle: {
      maxWidth: 340 * scale,
      marginBottom: 22 * scale,
      color: "rgba(255,255,255,0.68)",
      fontSize: 14 * scale,
      lineHeight: 20 * scale,
    },

    form: {
      padding: 18 * scale,
      backgroundColor: "rgba(10,8,14,0.82)",
      borderWidth: 1,
    
  width: "100%",

      borderColor: "rgba(255,255,255,0.14)",
      borderRadius: 18 * scale,
    },

    inputContainer: {
      marginBottom: 14 * scale,
    },

    label: {
      marginBottom: 6 * scale,
      color: "rgba(255,255,255,0.68)",
      fontSize: 12 * scale,
      fontWeight: "600",
    },

    input: {
      minHeight: 47 * scale,
      paddingHorizontal: 13 * scale,
      paddingVertical: 11 * scale,
      backgroundColor: "rgba(255,255,255,0.08)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.16)",
      borderRadius: 12 * scale,
      color: "#FFFFFF",
      fontSize: 15 * scale,
    },

    resetLinkWrapper: {
      alignSelf: "flex-end",
      marginTop: -2 * scale,
      marginBottom: 16 * scale,
    },

    forgotLink: {
      color: "#BFA4FF",
      fontSize: 13 * scale,
      fontWeight: "700",
    },

    linkPressed: {
      opacity: 0.65,
    },

    buttonContainer: {
      minHeight: 48 * scale,
      alignItems: "center",
      justifyContent: "center",
  backgroundColor: "rgba(40,25,60,0.88)",
borderColor: "rgba(180,140,255,0.3)",
      borderWidth: 1,
  
      borderRadius: 12 * scale,
    },

    buttonDisabled: {
      backgroundColor: "rgba(74,65,87,0.72)",
      borderColor: "rgba(255,255,255,0.1)",
    },

    buttonPressed: {
      opacity: 0.75,
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 14 * scale,
      fontWeight: "700",
      letterSpacing: 0.5,
    },

    signUpRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 5 * scale,
      marginTop: 18 * scale,
    },

    switchText: {
      color: "rgba(255,255,255,0.62)",
      fontSize: 13 * scale,
    },

    link: {
      color: "#BFA4FF",
      fontSize: 13 * scale,
      fontWeight: "700",
    },
  });
