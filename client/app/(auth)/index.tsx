import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "@react-navigation/elements";
import { router, useNavigation } from "expo-router";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Torq Fitness</Text>
      <Button onPressIn={() => router.navigate("/(auth)/login")}>Login</Button>
      <Button onPressIn={() => router.navigate("/(auth)/signUp")}>
        Sign Up
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 200,
  },
  title: {
    fontSize: 36,
    textAlign: "center",
  },
});
