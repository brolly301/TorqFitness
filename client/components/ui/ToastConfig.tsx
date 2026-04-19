import Toast, { BaseToastProps, ErrorToast } from "react-native-toast-message";
import { Text, View } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function ToastConfig() {
  const { theme } = useAppTheme();

  const toastConfig = {
    success: ({ text1, text2 }: BaseToastProps) => (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.card,
          borderLeftWidth: 6,
          borderLeftColor: theme.success,
          padding: 10,
          borderRadius: 8,
          marginHorizontal: 50,
        }}
      >
        <Feather
          name="check-circle"
          size={24}
          color={theme.success}
          style={{ marginRight: 13, marginLeft: 3 }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: theme.text,
              fontWeight: "bold",
              fontSize: 16,
              marginVertical: 2,
            }}
          >
            {text1}
          </Text>
          {text2 ? (
            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 14,
                marginVertical: 2,
                fontWeight: "500",
              }}
            >
              {text2}
            </Text>
          ) : null}
        </View>
      </View>
    ),
    error: (props: BaseToastProps) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: theme.error,
          backgroundColor: theme.surface,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: "bold",
          color: theme.text,
        }}
        text2Style={{ fontSize: 14, color: theme.textSecondary }}
      />
    ),
  };

  return <Toast config={toastConfig} visibilityTime={3000} topOffset={40} />;
}
