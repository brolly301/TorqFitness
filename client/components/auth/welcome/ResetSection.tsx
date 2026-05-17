import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import EmailForm from "@/components/auth/resetPassword/EmailForm";
import PasswordForm from "@/components/auth/resetPassword/PasswordForm";
import CodeForm from "@/components/auth/resetPassword/CodeForm";
import SuccessForm from "@/components/auth/resetPassword/SuccessForm";
import { SectionType } from "@/app/(auth)";

export type ResetStep = "email" | "code" | "password" | "success";

type Props = {
  setSection: (section: SectionType) => void;
};

export default function ResetSection({ setSection }: Props) {
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
      {step === "success" && (
        <SuccessForm setStep={setStep} setSection={setSection} />
      )}
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(10, 5, 20, 0.6)",
    },
    background: {
      flex: 1,
      width: "100%",
      alignItems: "center",
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      marginBottom: 10,
      alignSelf: "flex-start",
      color: "white",
    },
  });
