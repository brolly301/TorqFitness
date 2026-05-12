import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useLayoutEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/utils/validation/authSchema";
import AppError from "@/components/ui/AppError";
import { useUserContext } from "@/context/UserContext";
import { router, useNavigation } from "expo-router";
import { ResetStep } from "@/app/(auth)/resetPassword";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  setStep: React.Dispatch<React.SetStateAction<ResetStep>>;
};

export default function SuccessForm({ setStep }: Props) {
  const { theme, scale, themeType } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <View>
      <Text style={styles.subtitle}>
        Your password has successfully been reset. Click the button below to
        login.
      </Text>

      <Pressable
        style={styles.buttonContainer}
        onPress={() => router.replace("/(auth)/login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
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
