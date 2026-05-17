import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SectionType } from "@/app/(auth)";
import { Image } from "expo-image";
import EvilIcons from "@expo/vector-icons/EvilIcons";

type Props = {
  onBack: () => void;
};

export default function Header({ onBack }: Props) {
  return (
    <View style={styles.header}>
      <Pressable onPress={() => onBack()} style={styles.backButton}>
        <EvilIcons name="arrow-left" size={40} color="white" />
      </Pressable>

      <Image
        style={styles.logo}
        source={require("../../../assets/images/logo.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 34,
    zIndex: 2,
  },

  logo: {
    width: 110,
    height: 110,
  },
});
