import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import LoginForm from "@/components/auth/login/LoginForm";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/utils/validation/loginSchema";
import type { FormField } from "@/types/Global";
import AppError from "@/components/ui/AppError";
import { Button } from "@react-navigation/elements";
import { useUserContext } from "@/context/UserContext";

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const { login } = useUserContext();

  const loginFields: FormField<LoginFormValues>[] = [
    { name: "email", placeholder: "Email" },
    { name: "password", placeholder: "Password", secureTextEntry: true },
  ];

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <View>
      {loginFields.map((field) => {
        return (
          <Controller
            name={field.name}
            control={control}
            key={field.name}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  placeholder={field.placeholder}
                  placeholderTextColor={"black"}
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                  textAlignVertical="center"
                  secureTextEntry={field.secureTextEntry}
                />
                {errors[field.name] && (
                  <AppError>{errors[field.name]?.message}</AppError>
                )}
              </>
            )}
          />
        );
      })}
      <Button onPressIn={handleSubmit(onSubmit)}>Login</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: "black",
  },
});
