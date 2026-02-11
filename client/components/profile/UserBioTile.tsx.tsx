import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function UserBioTile() {
  return (
    <View style={styles.container}>
      <Image
        src="https://images.pexels.com/photos/35716664/pexels-photo-35716664.jpeg"
        style={styles.profileImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>Marc Brolly</Text>
        <Text style={styles.workouts}>207 Workouts</Text>
        <Text style={styles.member}>Member since March 2024</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  textContainer: {},
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 2.5,
  },
  workouts: {
    fontSize: 14,
    fontWeight: "400",
  },
});
