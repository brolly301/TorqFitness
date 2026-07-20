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
  ResetCodeFormValues,
  resetCodeSchema,
} from "@/utils/validation/authSchema";

import { useUserContext } from "@/context/UserContext";

import { useAppTheme } from "@/hooks/useAppTheme";
import { ResetStep } from "../welcome/ResetSection";
import { toggleToast } from "@/utils/toggleToast";

type Props = {
  setStep: React.Dispatch<React.SetStateAction<ResetStep>>;
  email: string;
};

export default function CodeForm({ setStep, email }: Props) {
  const { scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(scale), [scale]);

  const [loading, setLoading] = useState<boolean>(false);

  const { error, setError, verifyResetCode } = useUserContext();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ResetCodeFormValues>({
    resolver: zodResolver(resetCodeSchema),
    defaultValues: {
      code: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!error?.message) return;

    toggleToast({
      type: "error",
      text1: "Password  Reset Error.",
      text2: error.message,
    });

    setError(null);
  }, [error?.message]);

  const onSubmit = async (data: ResetCodeFormValues) => {
    if (loading) return;

    try {
      setLoading(true);
      const { code } = data;

      setError(null);

      const success = await verifyResetCode(code, email);

      if (success) {
        setStep("password");
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.subtitle}>
        Enter the verification code sent to{" "}
        <Text style={styles.email}>{email}</Text>.
      </Text>

      <Controller
        name="code"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Verification Code</Text>

            <TextInput
              placeholder="Enter code"
              placeholderTextColor="rgba(255,255,255,0.38)"
              onChangeText={onChange}
              value={value}
              keyboardType="default"
              autoCapitalize="characters"
              autoCorrect={false}
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              style={styles.input}
            />
          </View>
        )}
      />

      <Pressable
        disabled={loading || !isValid}
        style={({ pressed }) => [
          styles.buttonContainer,
          (loading || !isValid) && styles.buttonDisabled,
          pressed && !loading && isValid && styles.buttonPressed,
        ]}
        onPress={handleSubmit(onSubmit)}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Verify Code</Text>
        )}
      </Pressable>
    </View>
  );
}

const makeStyles = (scale: number) =>
  StyleSheet.create({
    form: {
      width: "100%",
      padding: 18 * scale,
      backgroundColor: "rgba(10,8,14,0.82)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.14)",
      borderRadius: 18 * scale,
    },

    subtitle: {
      marginBottom: 20 * scale,
      color: "rgba(255,255,255,0.68)",
      fontSize: 14 * scale,
      lineHeight: 20 * scale,
    },

    email: {
      color: "#FFFFFF",
      fontWeight: "600",
    },

    inputContainer: {
      marginBottom: 18 * scale,
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
      letterSpacing: 2 * scale,
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
      letterSpacing: 0.4,
    },
  });
