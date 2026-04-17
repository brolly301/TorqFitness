import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useMemo, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useUserContext } from "@/context/UserContext";
import { Theme } from "@/types/Theme";

type PasswordInputType = {
  password: string;
  confirmPassword: string;
};

export default function ChangePasswordForm() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { changePassword } = useUserContext();

  const [focused, setFocused] = useState<boolean>(false);

  const [passwordData, setPasswordData] = useState<PasswordInputType>({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = () => {
    if (passwordData.password !== passwordData.confirmPassword) return;

    changePassword(passwordData.password);
  };

  return (
    <View>
      <Text style={styles.label}>Password</Text>

      <TextInput
        placeholder="Password"
        returnKeyType="done"
        placeholderTextColor={theme.textSecondary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        value={passwordData.password}
        secureTextEntry
        style={[
          styles.input,
          {
            borderColor: focused ? theme.inputFocusBorder : theme.inputBorder,
          },
        ]}
        textAlignVertical="center"
        onChangeText={(text) =>
          setPasswordData((prev) => ({ ...prev, password: text }))
        }
      />
      <Text style={styles.label}>Confirm Password</Text>

      <TextInput
        placeholder="Confirm Password"
        returnKeyType="done"
        placeholderTextColor={theme.textSecondary}
        onFocus={() => setFocused(true)}
        secureTextEntry
        onBlur={() => setFocused(false)}
        value={passwordData.confirmPassword}
        style={[
          styles.input,
          {
            borderColor: focused ? theme.inputFocusBorder : theme.inputBorder,
          },
        ]}
        textAlignVertical="center"
        onChangeText={(text) =>
          setPasswordData((prev) => ({ ...prev, confirmPassword: text }))
        }
      />
      <Pressable
        onPress={handleSubmit}
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
          Update Password
        </Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      padding: 16 * scale,
      backgroundColor: theme.card,
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
      marginBottom: 16 * scale,
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
