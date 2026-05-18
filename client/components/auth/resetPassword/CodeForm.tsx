import {
  ActivityIndicator,
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
  ResetCodeFormValues,
  resetCodeSchema,
} from "@/utils/validation/authSchema";
import AppError from "@/components/ui/AppError";
import { useUserContext } from "@/context/UserContext";
import { useNavigation } from "expo-router";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ResetStep } from "../welcome/ResetSection";

type Props = {
  setStep: React.Dispatch<React.SetStateAction<ResetStep>>;
  email: string;
};

export default function CodeForm({ setStep, email }: Props) {
  const { theme, scale, themeType } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const [loading, setLoading] = useState<boolean>(false);

  const { error, setError, verifyResetCode } = useUserContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetCodeFormValues>({
    resolver: zodResolver(resetCodeSchema),
    defaultValues: {
      code: "",
    },
    mode: "onSubmit",
  });

  const navigation = useNavigation();

  useLayoutEffect(() => {
    setError(null);
  }, [navigation]);

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
    <View>
      <Text style={styles.subtitle}>Please enter your code below.</Text>
      <Controller
        name="code"
        key="code"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Code"
              placeholderTextColor={"black"}
              onChangeText={onChange}
              textAlignVertical="center"
              value={value}
              autoComplete="off"
              textContentType="oneTimeCode"
              importantForAutofill="no"
              style={[styles.input, { marginBottom: errors.code ? 10 : 0 }]}
            />
            {errors.code && <AppError>{errors.code?.message}</AppError>}
          </View>
        )}
      />
      {error?.message && !errors.code && <AppError>{error.message}</AppError>}
      <Pressable
        disabled={loading}
        style={[
          styles.buttonContainer,
          {
            backgroundColor: loading
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
          <Text style={styles.buttonText}>Verify Code</Text>
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
