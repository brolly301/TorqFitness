import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import EmailForm from "@/components/auth/resetPassword/EmailForm";
import PasswordForm from "@/components/auth/resetPassword/PasswordForm";
import CodeForm from "@/components/auth/resetPassword/CodeForm";
import SuccessForm from "@/components/auth/resetPassword/SuccessForm";

export type ResetStep = "email" | "code" | "password" | "success";

export default function ResetPasswordScreen() {
  const { theme, scale, themeType } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState<string>("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      {step === "email" && <EmailForm setStep={setStep} setEmail={setEmail} />}
      {step === "code" && <CodeForm setStep={setStep} email={email} />}
      {step === "password" && <PasswordForm setStep={setStep} email={email} />}
      {step === "success" && <SuccessForm setStep={setStep} />}
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
