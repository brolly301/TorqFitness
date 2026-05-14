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
      imageStyle={{}}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../../assets/images/logo.png")}
          />

          <Text style={[styles.tagline]}>Train with intent.</Text>
        </View>
        <View
          style={{ width: "100%", paddingHorizontal: 30, paddingBottom: 50 }}
        >
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
      paddingTop: 40,
      alignItems: "center",
      flex: 1,
    },
    background: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(10, 5, 20, 0.6)",
    },
    imageNL: {
      width: 400,
      height: 400,
    },
    image: {
      width: 450,
      height: 450,
    },
    buttonContainer: {
      backgroundColor: "rgba(40, 25, 60, 0.35)",
      borderColor: "rgba(180, 140, 255, 0.25)",
      borderWidth: 2,
      borderRadius: 16,
      paddingVertical: 12,

      width: "100%",
      marginVertical: 8,
      alignItems: "center",

      // borderColor: "white",
    },
    buttonText: {
      color: "#F4EEFF",
      fontWeight: "600",
      letterSpacing: 2,
      fontSize: 14,
    },

    tagline: {
      fontSize: 18,
      color: "rgba(255,255,255,0.75)",
      marginTop: -110,
      letterSpacing: 1,
      fontStyle: "italic",
    },
  });
