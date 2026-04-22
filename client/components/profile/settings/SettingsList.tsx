import { StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Theme } from "@/types/Theme";
import { useAppTheme } from "@/hooks/useAppTheme";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import SettingsSection from "./SettingsSection";
import { router } from "expo-router";
import { useUserContext } from "@/context/UserContext";
import AppearanceModal from "@/components/modals/settings/AppearanceModal";
import UnitsModal from "@/components/modals/settings/UnitsModal";
import RateModal from "@/components/modals/settings/RateModal";

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
    onPress: () => router.navigate("/profile/editProfile"),
  },
  {
    label: "Change Password",
    icon: "lock-outline",
    iconType: "materialCommunity",
    onPress: () => router.navigate("/profile/changePassword"),
  },
];

const SUPPORT_ITEMS: SettingsItem[] = [
  {
    label: "Contact",
    icon: "mail",
    iconType: "feather",
    onPress: () =>
      router.navigate({
        pathname: "/profile/support",
        params: { formType: "contact" },
      }),
  },
  {
    label: "Report Issue",
    icon: "alert-outline",
    iconType: "materialCommunity",
    onPress: () =>
      router.navigate({
        pathname: "/profile/support",
        params: { formType: "report" },
      }),
  },
  {
    label: "Feedback",
    icon: "message-square",
    iconType: "feather",
    onPress: () =>
      router.navigate({
        pathname: "/profile/support",
        params: { formType: "feedback" },
      }),
  },
];

export default function SettingsList() {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);
  const { logout } = useUserContext();
  const [appearanceVisible, setAppearanceVisible] = useState<boolean>(false);
  const [unitsVisible, setUnitsVisible] = useState<boolean>(false);
  const [rateVisible, setRateVisible] = useState<boolean>(false);

  const OTHER_ITEMS: SettingsItem[] = [
    {
      label: "Rate App",
      icon: "star-outline",
      iconType: "materialCommunity",
      onPress: () => setRateVisible(true),
    },
    {
      label: "Log Out",
      icon: "log-out",
      iconType: "feather",
      danger: true,
      onPress: () => logout(),
    },
  ];

  const APP_ITEMS: SettingsItem[] = [
    {
      label: "Appearance",
      icon: "palette",
      iconType: "materialCommunity",
      onPress: () => setAppearanceVisible(true),
    },
    {
      label: "Units",
      icon: "straighten",
      iconType: "material",
      onPress: () => setUnitsVisible(true),
    },
  ];

  return (
    <>
      <AppearanceModal
        modalVisible={appearanceVisible}
        setModalVisible={setAppearanceVisible}
      />
      <UnitsModal
        modalVisible={unitsVisible}
        setModalVisible={setUnitsVisible}
      />
      <RateModal modalVisible={rateVisible} setModalVisible={setRateVisible} />
      <View style={styles.container}>
        <SettingsSection title="Account" items={ACCOUNT_ITEMS} />
        <SettingsSection title="App" items={APP_ITEMS} />
        <SettingsSection title="Support" items={SUPPORT_ITEMS} />
        <SettingsSection title="Other" items={OTHER_ITEMS} />
      </View>
    </>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {},
  });
