import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { SectionType } from "@/app/(auth)";

type Props = {
  setSection: React.Dispatch<React.SetStateAction<SectionType>>;
};

export default function WelcomeSection({ setSection }: Props) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../../assets/images/logo.png")}
      />

      <Text style={[styles.tagline]}>Train with intent.</Text>
      <View style={styles.actions}>
        <Pressable
          onPress={() => setSection("login")}
          style={({ pressed }) => [
            styles.button,
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Log In</Text>
        </Pressable>

        <Pressable
          onPress={() => setSection("signUp")}
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.secondaryButtonText}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },

  image: {
    width: 450,
    height: 450,
  },

  tagline: {
    marginTop: -110,
    color: "rgba(255,255,255,0.75)",
    fontSize: 18,
    fontStyle: "italic",
    letterSpacing: 1,
  },

  actions: {
    width: "100%",
    marginTop: "auto",
    paddingHorizontal: 30,
    paddingBottom: 50,
    gap: 12,
  },

  button: {
    width: "100%",
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
  },

  primaryButton: {
    backgroundColor: "rgba(40,25,60,0.88)",
    borderColor: "rgba(180,140,255,0.3)",
  },

  secondaryButton: {
    backgroundColor: "rgba(10,8,14,0.76)",
    borderColor: "rgba(255,255,255,0.16)",
  },

  buttonPressed: {
    opacity: 0.75,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  secondaryButtonText: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});
