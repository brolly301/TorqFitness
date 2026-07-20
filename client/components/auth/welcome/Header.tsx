import { Pressable, StyleSheet, View } from "react-native";
import React, { useMemo } from "react";
import { Image } from "expo-image";
import Feather from "@expo/vector-icons/Feather";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  onBack: () => void;
};

export default function Header({ onBack }: Props) {
  const { scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(scale), [scale]);

 return (
  <View style={styles.header}>
    <Pressable
      onPress={onBack}
      style={({ pressed }) => [
        styles.backButton,
        pressed && styles.backButtonPressed,
      ]}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Feather
        name="arrow-left"
        size={21 * scale}
        color="#FFFFFF"
      />
    </Pressable>

    <View style={styles.logoContainer}>
      <View style={styles.logoFrame}>
        <Image
          style={styles.logo}
          source={require("../../../assets/images/logo.png")}
          contentFit="contain"
        />
      </View>
    </View>

    <View style={styles.headerSpacer} />
  </View>
);
}

const makeStyles = (scale: number) =>
  StyleSheet.create({
    header: {
      minHeight: 68 * scale,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 30 * scale,
    },

    backButton: {
      width: 40 * scale,
      height: 40 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(15,12,20,0.68)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
      borderRadius: 12 * scale,
    },

    backButtonPressed: {
      opacity: 0.65,
    },

    logoContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    logoFrame: {
      width: 120 * scale,
      height: 68 * scale,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
    },

    logo: {
      position: "absolute",
      top: -38 * scale,
      width: 150 * scale,
      height: 150 * scale,
    },

    headerSpacer: {
      width: 40 * scale,
      height: 40 * scale,
    },
  });