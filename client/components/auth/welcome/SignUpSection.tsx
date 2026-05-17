import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useLayoutEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  SignUpFormValues,
  signUpSchema,
} from "../../../utils/validation/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/types/Global";
import AppError from "@/components/ui/AppError";
import { useUserContext } from "@/context/UserContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import { router, useNavigation } from "expo-router";
import { SectionType } from "@/app/(auth)";

type Props = {
  setSection: (section: SectionType) => void;
};

export default function SignUpSection({ setSection }: Props) {
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
    mode: "onSubmit",
  });

  const { signUp, setError, error } = useUserContext();

  const navigation = useNavigation();

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

  useLayoutEffect(() => {
    setError(null);
  }, [navigation]);

  const onSubmit = (data: SignUpFormValues) => {
    const { confirmPassword, ...body } = data;

    if (confirmPassword !== body.password) {
      return console.log("NOPE");
    }

    signUp(body);
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
                  placeholderTextColor={"black"}
                  onChangeText={onChange}
                  textAlignVertical={"center"}
                  secureTextEntry={field.secureTextEntry}
                  value={value}
                  autoComplete="off"
                  textContentType="oneTimeCode"
                  importantForAutofill="no"
                  style={[
                    styles.input,
                    { marginBottom: errors[field.name] ? 10 : 0 },
                  ]}
                />
                {errors[field.name] && (
                  <AppError>{errors[field.name]?.message}</AppError>
                )}
              </View>
            )}
          />
        );
      })}
      {error?.message && <AppError>{error.message}</AppError>}
      <Pressable
        style={styles.buttonContainer}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
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
      borderColor: theme.inputBorder,
      paddingHorizontal: 12 * scale,
      paddingVertical: 12 * scale,
      backgroundColor: "rgba(255,255,255,0.92)",
      fontSize: 15 * scale,

      color: theme.text,
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
