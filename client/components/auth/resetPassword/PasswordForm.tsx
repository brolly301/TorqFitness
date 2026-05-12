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
import { useNavigation } from "expo-router";
import { ResetStep } from "@/app/(auth)/resetPassword";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  setStep: React.Dispatch<React.SetStateAction<ResetStep>>;
  email: string;
};

export default function PasswordForm({ setStep, email }: Props) {
  const { theme, scale, themeType } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { error, setError, resetPassword } = useUserContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const navigation = useNavigation();

  useLayoutEffect(() => {
    setError(null);
  }, [navigation]);

  const onSubmit = (data: ResetPasswordFormValues) => {
    const { password } = data;
    resetPassword(password, email);
    setStep("success");
  };

  return (
    <View>
      <Text style={styles.subtitle}>Please enter your new password below.</Text>
      <Controller
        name="password"
        key="password"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              placeholder="Password"
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
      {errors.password && <AppError>{errors.password?.message}</AppError>}
      <Controller
        name="confirmPassword"
        key="confirmPassword"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              placeholder="Confirm Password"
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
      {errors.confirmPassword && (
        <AppError>{errors.confirmPassword?.message}</AppError>
      )}
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
