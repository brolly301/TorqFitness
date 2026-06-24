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
import {
  SignUpFormValues,
  signUpSchema,
} from "../../../utils/validation/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/types/Global";
import { useUserContext } from "@/context/UserContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import { SectionType } from "@/app/(auth)";
import { toggleToast } from "@/utils/toggleToast";

type Props = {
  setSection: (section: SectionType) => void;
};

export default function SignUpSection({ setSection }: Props) {
  const { theme, scale, themeType } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Your Journey</Text>
      <Text style={styles.subtitle}>Track workouts. Build consistency.</Text>
      {signUpFields.map((field) => {
        return (
          <Controller
            name={field.name}
            key={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder={field.placeholder}
                  placeholderTextColor={"#111827"}
                  onChangeText={onChange}
                  textAlignVertical={"center"}
                  secureTextEntry={field.secureTextEntry}
                  value={value}
                  autoComplete="off"
                  textContentType="oneTimeCode"
                  importantForAutofill="no"
                  style={[styles.input]}
                />
              </View>
            )}
          />
        );
      })}

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
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </Pressable>
      <Pressable onPress={() => setSection("login")} style={{ marginTop: 20 }}>
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
      borderRadius: 12 * scale,
      borderWidth: 1,
      borderColor: "#D1D5DB",
      paddingHorizontal: 12 * scale,
      paddingVertical: 12 * scale,
      backgroundColor: "rgba(255,255,255,0.92)",
      fontSize: 15 * scale,
      color: "#111827",
    },
    inputContainer: { marginBottom: 10 },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(10, 5, 20, 0.6)",
    },
    background: {
      flex: 1,
      width: "100%",
      alignItems: "center",
    },
    container: {
      flex: 1,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      marginBottom: 10,
      alignSelf: "flex-start",
      color: "white",
    },

    subtitle: {
      color: "rgba(255,255,255,0.78)",
      fontSize: 15,
      marginBottom: 40,
      alignSelf: "flex-start",
    },
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

    switchText: {
      color: "rgba(255,255,255,0.78)",
      fontSize: 14,
      textAlign: "center",
    },

    link: {
      color: "#C084FC",
      fontWeight: "700",
    },
  });
