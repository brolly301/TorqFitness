import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useUserContext } from "@/context/UserContext";

type UserInputType = {
  firstName: string;
  surname: string;
  email: string;
};

export default function EditProfileForm() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const { user } = useUserContext();

  const [focused, setFocused] = useState<boolean>(false);

  if (!user) return;

  const [userData, setUserData] = useState<UserInputType>({
    firstName: user?.firstName,
    surname: user?.surname,
    email: user?.email,
  });

  const handleSubmit = () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First name</Text>
      <TextInput
        placeholder="First name"
        returnKeyType="done"
        placeholderTextColor={theme.textSecondary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        value={userData.firstName}
        style={[
          styles.input,
          {
            borderColor: focused ? theme.inputFocusBorder : theme.inputBorder,
          },
        ]}
        textAlignVertical="center"
        onChangeText={(text) =>
          setUserData((prev) => ({ ...prev, firstName: text }))
        }
      />
      <Text style={styles.label}>Surname</Text>
      <TextInput
        placeholder="Surname"
        returnKeyType="done"
        placeholderTextColor={theme.textSecondary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        value={userData.surname}
        style={[
          styles.input,
          {
            borderColor: focused ? theme.inputFocusBorder : theme.inputBorder,
          },
        ]}
        textAlignVertical="center"
        onChangeText={(text) =>
          setUserData((prev) => ({ ...prev, surname: text }))
        }
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Email"
        returnKeyType="done"
        placeholderTextColor={theme.textSecondary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        value={userData.email}
        style={[
          styles.input,
          {
            borderColor: focused ? theme.inputFocusBorder : theme.inputBorder,
          },
        ]}
        textAlignVertical="center"
        onChangeText={(text) =>
          setUserData((prev) => ({ ...prev, email: text }))
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
