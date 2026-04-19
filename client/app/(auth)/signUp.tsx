import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  SignUpFormValues,
  signUpSchema,
} from "@/utils/validation/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/types/Global";
import AppError from "@/components/ui/AppError";
import { Button } from "@react-navigation/elements";
import { useUserContext } from "@/context/UserContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import { router } from "expo-router";

export default function SignUpScreen() {
  const { theme, scale, themeType } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { signUp } = useUserContext();

  const signUpFields: FormField<SignUpFormValues>[] = [
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

  const onSubmit = (data: SignUpFormValues) => {
    const { confirmPassword, ...body } = data;

    if (confirmPassword !== body.password) {
      return console.log("NOPE");
    }

    signUp(body);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Access your notes anytime, anywhere.</Text>
      {signUpFields.map((field) => {
        return (
          <Controller
            name={field.name}
            key={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  placeholder={field.placeholder}
                  placeholderTextColor={"black"}
                  onChangeText={onChange}
                  textAlignVertical={"center"}
                  secureTextEntry={field.secureTextEntry}
                  value={value}
                  autoComplete="off"
                  textContentType="oneTimeCode"
                  importantForAutofill="no"
                  style={styles.input}
                />
                {errors[field.name] && (
                  <AppError>{errors[field.name]?.message}</AppError>
                )}
              </>
            )}
          />
        );
      })}
      <Pressable
        style={styles.buttonContainer}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <Pressable
        onPress={() => router.replace("/(auth)/login")}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.switchText}>
          Already have an account? <Text style={styles.link}>Log in</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    input: {
      borderWidth: 1,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderColor: theme.border,
      padding: 13,
      marginVertical: 8,
      fontSize: 16,
      borderRadius: 12,
      color: theme.text,
    },
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
    buttonContainer: {
      backgroundColor: theme.buttonPrimary,
      borderWidth: 1,
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
  });
