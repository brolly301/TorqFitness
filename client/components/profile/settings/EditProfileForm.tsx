import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useUserContext } from "@/context/UserContext";
import AppError from "@/components/ui/AppError";
import { useNavigation } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  UpdateProfileFormValues,
  updateProfileSchema,
} from "../../../utils/validation/authSchema";
import { FormField } from "@/types/Global";

export type UserInputType = {
  firstName: string;
  surname: string;
  email: string;
};

export default function EditProfileForm() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { user, updateUser, error, setError } = useUserContext();

  const [focused, setFocused] = useState<boolean>(false);

  if (!user) return;

  console.log(user);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      surname: user.surname,
      email: user.email,
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: UpdateProfileFormValues) => {
    updateUser(data);
  };

  const navigation = useNavigation();

  useLayoutEffect(() => {
    setError(null);
  }, [navigation]);

  const profileFields: FormField<UpdateProfileFormValues>[] = [
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
  ];

  return (
    <View style={styles.container}>
      {profileFields.map((field) => {
        return (
          <Controller
            name={field.name}
            control={control}
            key={field.name}
            render={({ field: { onChange, value } }) => (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.label}>{field.placeholder}</Text>
                <TextInput
                  placeholder={field.placeholder}
                  onChangeText={onChange}
                  textAlignVertical="center"
                  value={value}
                  placeholderTextColor={theme.text}
                  autoComplete="off"
                  textContentType="oneTimeCode"
                  importantForAutofill="no"
                  style={styles.input}
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
        onPress={handleSubmit(onSubmit)}
        // disabled={isDisabled}
        style={[
          styles.button,
          {
            backgroundColor:
              // isDisabled
              //   ?
              //    theme.buttonDisabled
              //   :
              theme.buttonPrimary,
          },
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color: theme.buttonPrimaryText,
            },
          ]}
        >
          Update Details
        </Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      padding: 16 * scale,
      paddingVertical: 20,

      backgroundColor: theme.surface,
      borderRadius: 14 * scale,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 4,
    },

    label: {
      fontSize: 13 * scale,
      color: theme.textSecondary,
      marginBottom: 6 * scale,
    },

    input: {
      borderRadius: 12 * scale,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      paddingHorizontal: 12 * scale,
      paddingVertical: 12 * scale,
      backgroundColor: theme.buttonSecondary,
      marginBottom: 5 * scale,
      fontSize: 15 * scale,
      color: theme.text,
    },

    button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12 * scale,
      paddingVertical: 12 * scale,
      marginTop: 10 * scale,
    },

    buttonText: {
      fontSize: 15 * scale,
      fontWeight: "700",
    },
  });
