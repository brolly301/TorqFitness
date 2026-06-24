import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetEmailFormValues,
  resetEmailSchema,
} from "@/utils/validation/authSchema";
import AppError from "@/components/ui/AppError";
import { useUserContext } from "@/context/UserContext";
import { useNavigation } from "expo-router";

import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ResetStep } from "../welcome/ResetSection";
import { toggleToast } from "@/utils/toggleToast";

type Props = {
  setStep: React.Dispatch<React.SetStateAction<ResetStep>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
};

export default function EmailForm({ setStep, setEmail }: Props) {
  const { theme, scale, themeType } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const [loading, setLoading] = useState<boolean>(false);

  const { error, setError, requestResetCode } = useUserContext();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ResetEmailFormValues>({
    resolver: zodResolver(resetEmailSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!error?.message) return;

    toggleToast({
      type: "error",
      text1: "Password Reset Error.",
      text2: error.message,
    });

    setError(null);
  }, [error?.message]);

  const onSubmit = async (data: ResetEmailFormValues) => {
    if (loading) return;
    try {
      setLoading(true);
      const { email } = data;
      const success = await requestResetCode(email);

      if (success) {
        setEmail(email);
        setStep("code");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text style={styles.subtitle}>Please enter your email below.</Text>
      <Controller
        name="email"
        key="email"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor={"black"}
              onChangeText={onChange}
              textAlignVertical="center"
              value={value}
              autoComplete="off"
              textContentType="oneTimeCode"
              importantForAutofill="no"
              style={[styles.input]}
            />
          </View>
        )}
      />
      <Pressable
        disabled={loading || !isValid}
        style={[
          styles.buttonContainer,
          {
            backgroundColor:
              loading || !isValid
                ? "rgba(53, 44, 66, 0.8)"
                : "rgba(40, 25, 60, 0.8)",
          },
        ]}
        onPress={handleSubmit(onSubmit)}
      >
        {loading ? (
          <ActivityIndicator
            color={"rgba(255,255,255,0.78)"}
            style={{ zIndex: 1 }}
          />
        ) : (
          <Text style={styles.buttonText}>Send Reset Link</Text>
        )}
      </Pressable>
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    subtitle: {
      color: "rgba(255,255,255,0.78)",
      fontSize: 15,
      marginBottom: 40,
      alignSelf: "flex-start",
    },
    input: {
      borderRadius: 12 * scale,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      paddingHorizontal: 12 * scale,
      paddingVertical: 12 * scale,
      backgroundColor: "rgba(255,255,255,0.92)",
      fontSize: 15 * scale,
      color: theme.text,
    },
    inputContainer: { marginBottom: 10 },
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
      letterSpacing: 1.6,
      fontSize: 14,
    },
  });
