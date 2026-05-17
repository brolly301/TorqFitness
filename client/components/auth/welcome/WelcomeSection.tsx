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
      <View
        style={{
          width: "100%",
          paddingHorizontal: 30,
          paddingBottom: 50,
          marginTop: "auto",
        }}
      >
        <Pressable
          onPress={() => setSection("login")}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable
          onPress={() => setSection("signUp")}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    alignItems: "center",
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: "rgba(40, 25, 60, 0.8)",
    borderColor: "rgba(180, 140, 255, 0.25)",
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 12,

    width: "100%",
    marginVertical: 8,
    alignItems: "center",
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
  image: {
    width: 450,
    height: 450,
  },
});
