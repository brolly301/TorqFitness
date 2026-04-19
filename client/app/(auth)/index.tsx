import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useMemo } from "react";
import { Button } from "@react-navigation/elements";
import { router, useNavigation } from "expo-router";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Image } from "expo-image";

export default function WelcomeScreen() {
  const { theme, scale, themeType } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <ImageBackground
      source={require("../../assets/images/welcomeBG.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require("../../assets/images/logo.png")}
        />
        <Text style={[styles.tagline]}>Train with intent.</Text>
        <View style={{ width: "100%" }}>
          <Pressable
            onPress={() => router.navigate("/(auth)/login")}
            style={styles.buttonContainer}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
          <Pressable
            onPress={() => router.navigate("/(auth)/signUp")}
            style={styles.buttonContainer}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      paddingVertical: 100,
      paddingHorizontal: 30,
      alignItems: "center",
      flex: 1,
    },
    background: {
      flex: 1,
      width: "100%",
      height: "100%",
    },

    image: {
      width: 300,
      height: 300,
    },
    buttonContainer: {
      backgroundColor: "#E6DAC9",
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
      width: "100%",
      marginVertical: 10,
      alignItems: "center",
    },
    buttonText: {
      textAlign: "center",
      color: "#180C19",
      fontWeight: "600",
      letterSpacing: 0.5,
      fontSize: 18,
    },

    tagline: {
      fontSize: 24,
      color: "#E6DAC9",
      marginBottom: 40,
      marginTop: -50,
      textAlign: "center",
      letterSpacing: 0.5,
      fontStyle: "italic",
    },
  });
