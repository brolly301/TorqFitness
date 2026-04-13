import { Image, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { useUserContext } from "@/context/UserContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import { Button } from "@react-navigation/elements";

export default function UserBioTile() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const { user, deleteAccount, logout } = useUserContext();

  return (
    <View style={styles.container}>
      <Image
        src="https://images.pexels.com/photos/35716664/pexels-photo-35716664.jpeg"
        style={styles.profileImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>
          {user?.firstName} {user?.surname}
        </Text>
        <Text style={styles.workouts}>207 Workouts</Text>
        <Text style={styles.member}>Member since March 2024</Text>
        <Button onPressIn={deleteAccount}>Delete Account</Button>
        <Button onPressIn={logout}>Log out</Button>
      </View>
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginRight: 20 * scale,
    },
    textContainer: {},
    name: {
      fontSize: 28 * scale,
      fontWeight: "bold",
      marginBottom: 2.5 * scale,
    },
    workouts: {
      fontSize: 14 * scale,
      fontWeight: "400",
    },
  });
