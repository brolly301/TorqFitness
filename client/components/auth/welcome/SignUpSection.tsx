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
import {
  SignUpFormValues,
  signUpSchema,
} from "../../../utils/validation/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/types/Global";
import { useUserContext } from "@/context/UserContext";
import { useAppTheme } from "@/hooks/useAppTheme";

import { SectionType } from "@/app/(auth)";
import { toggleToast } from "@/utils/toggleToast";

type Props = {
  setSection: (section: SectionType) => void;
};

export default function SignUpSection({ setSection }: Props) {
  const { scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(scale), [scale]);

  const [loading, setLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { signUp, setError, error } = useUserContext();

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

  useEffect(() => {
    if (!error?.message) return;

    toggleToast({
      type: "error",
      text1: "Sign Up Error.",
      text2: error.message,
    });

    setError(null);
  }, [error?.message]);

  const onSubmit = async (data: SignUpFormValues) => {
    if (loading) return;
    try {
      setLoading(true);

      const { confirmPassword, ...body } = data;

      if (confirmPassword !== body.password) {
        return console.log("NOPE");
      }

      await signUp(body);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !isValid;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start your journey</Text>

      <Text style={styles.subtitle}>
        Create an account and start building consistent training habits.
      </Text>
      <View style={styles.form}>
        {signUpFields.map((field) => (
          <Controller
            name={field.name}
            key={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{field.placeholder}</Text>

                <TextInput
                  placeholder={field.placeholder}
                  placeholderTextColor="rgba(255,255,255,0.38)"
                  onChangeText={onChange}
                  textAlignVertical="center"
                  secureTextEntry={field.secureTextEntry}
                  value={value}
                  keyboardType={
                    field.name === "email" ? "email-address" : "default"
                  }
                  autoCapitalize={field.name === "email" ? "none" : "words"}
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="oneTimeCode"
                  importantForAutofill="no"
                  style={styles.input}
                />
              </View>
            )}
          />
        ))}

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
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.loginRow}>
        <Text style={styles.switchText}>Already have an account?</Text>

        <Pressable
          onPress={() => setSection("login")}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Log in"
        >
          <Text style={styles.link}>Log in</Text>
        </Pressable>
      </View>
    </View>
  );
}

const makeStyles = (scale: number) =>
  StyleSheet.create({
    container: {
      width: "100%",
      paddingBottom: 12 * scale,
    },

    title: {
      marginBottom: 7 * scale,
      color: "#FFFFFF",
      fontSize: 30 * scale,
      fontWeight: "700",
    },

    subtitle: {
      maxWidth: 350 * scale,
      marginBottom: 22 * scale,
      color: "rgba(255,255,255,0.68)",
      fontSize: 14 * scale,
      lineHeight: 20 * scale,
    },

    inputContainer: {
      marginBottom: 13 * scale,
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

    buttonContainer: {
      minHeight: 48 * scale,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 5 * scale,
      backgroundColor: "rgba(40,25,60,0.88)",
      borderColor: "rgba(180,140,255,0.3)",
      borderWidth: 1,
      borderRadius: 12 * scale,
    },

    buttonDisabled: {
      backgroundColor: "rgba(74,65,87,0.72)",
      borderColor: "rgba(255,255,255,0.1)",
    },
    form: {
      padding: 18 * scale,
      backgroundColor: "rgba(10,8,14,0.82)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.14)",
      borderRadius: 18 * scale,
    },

    buttonPressed: {
      opacity: 0.75,
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 14 * scale,
      fontWeight: "700",
      letterSpacing: 0.4,
    },

    loginRow: {
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
