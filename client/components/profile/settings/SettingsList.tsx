import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import SettingsSection from "./SettingsSection";

export type SettingsItem = {
  label: string;
  iconType: "feather" | "material" | "materialCommunity" | "entypo";
  icon:
    | React.ComponentProps<typeof Feather>["name"]
    | React.ComponentProps<typeof MaterialIcons>["name"]
    | React.ComponentProps<typeof MaterialCommunityIcons>["name"]
    | React.ComponentProps<typeof Entypo>["name"];
  danger?: boolean;
  onPress?: () => void;
};

const ACCOUNT_ITEMS: SettingsItem[] = [
  {
    label: "Edit Profile",
    icon: "edit-2",
    iconType: "feather",
  },
  {
    label: "Change Password",
    icon: "lock-outline",
    iconType: "materialCommunity",
  },
];

const APP_ITEMS: SettingsItem[] = [
  {
    label: "Appearance",
    icon: "palette",
    iconType: "materialCommunity",
  },
  {
    label: "Units",
    icon: "straighten",
    iconType: "material",
  },
];

const SUPPORT_ITEMS: SettingsItem[] = [
  {
    label: "Contact",
    icon: "mail",
    iconType: "feather",
  },
  {
    label: "Report Issue",
    icon: "alert-outline",
    iconType: "materialCommunity",
  },
  {
    label: "Feedback",
    icon: "message-square",
    iconType: "feather",
  },
];

const OTHER_ITEMS: SettingsItem[] = [
  {
    label: "Rate App",
    icon: "star-outline",
    iconType: "materialCommunity",
  },
  {
    label: "Log Out",
    icon: "log-out",
    iconType: "feather",
    danger: true,
  },
];

export default function SettingsList() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <View style={styles.container}>
      <SettingsSection title="Account" items={ACCOUNT_ITEMS} />
      <SettingsSection title="App" items={APP_ITEMS} />
      <SettingsSection title="Support" items={SUPPORT_ITEMS} />
      <SettingsSection title="Other" items={OTHER_ITEMS} />
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {},
  });
