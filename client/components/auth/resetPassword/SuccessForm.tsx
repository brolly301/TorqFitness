import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { SectionType } from "@/app/(auth)";

type Props = {
  setSection: (section: SectionType) => void;
};

export default function SuccessForm({ setSection }: Props) {
  const { scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(scale), [scale]);

  return (
    <View style={styles.form}>
      <Text style={styles.heading}>Password updated</Text>

      <Text style={styles.subtitle}>
        Your password has been reset successfully. You can now log in using your
        new password.
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.buttonContainer,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => setSection("login")}
      >
        <Text style={styles.buttonText}>Return to Log In</Text>
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

    heading: {
      marginBottom: 8 * scale,
      color: "#FFFFFF",
      fontSize: 18 * scale,
      fontWeight: "700",
    },

    subtitle: {
      marginBottom: 20 * scale,
      color: "rgba(255,255,255,0.68)",
      fontSize: 14 * scale,
      lineHeight: 20 * scale,
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
