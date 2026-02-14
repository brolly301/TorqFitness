import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import SettingsTile from "./SettingsTile";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function SettingsList() {
  const accountSettings = [
    {
      id: "1",
      name: "Edit Profile",
      icon: <FontAwesome6 name="user" size={24} color="black" />,
    },
    {
      id: "2",
      name: "Privacy Settings",
      icon: <MaterialIcons name="lock-outline" size={24} color="black" />,
    },
  ];

  const appSettings = [
    {
      id: "1",
      name: "Theme",
      icon: <Ionicons name="color-palette" size={24} color="black" />,
    },
    {
      id: "2",
      name: "Units",
      icon: <MaterialIcons name="straighten" size={24} color="black" />,
    },
    {
      id: "3",
      name: "Sync Workouts",
      icon: <MaterialCommunityIcons name="sync" size={20} color={"black"} />,
    },
    {
      id: "4",
      name: "Help & Support",
      icon: <Feather name="help-circle" size={24} color="black" />,
    },
    {
      id: "5",
      name: "Log out",
      icon: <MaterialCommunityIcons name="abacus" size={20} color={"black"} />,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Account Settings</Text>
      <FlatList
        data={accountSettings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <SettingsTile setting={item} />;
        }}
      />
      <Text style={styles.headerTitle}>App Settings</Text>
      <FlatList
        data={appSettings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <SettingsTile setting={item} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {},
});
