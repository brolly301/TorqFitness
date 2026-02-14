import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Setting } from "@/types/Global";

type Props = {
  setting: Setting;
};

export default function SettingsTile({ setting }: Props) {
  return (
    <View>
      <Text>{setting.icon}</Text>
      <Text>{setting.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
