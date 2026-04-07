import { StatusBar, StyleSheet, Text, View } from "react-native";
import React, { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
};

export default function AppWrapper({ children }: Props) {
  return (
    <SafeAreaView>
      <StatusBar barStyle={"dark-content"} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
