import { Redirect, Tabs, usePathname } from "expo-router";
import React, { useEffect } from "react";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useAppTheme } from "@/hooks/useAppTheme";
import StartButton from "@/components/ui/StartButton";

export default function TabLayout() {
  const { theme } = useAppTheme();

  return (
    <Tabs
      initialRouteName="workout"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingTop: 10,
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
      }}
    >
      <Tabs.Screen
        name="routines"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => {
            return (
              <FontAwesome6 name="list" size={20} color={theme.buttonPrimary} />
            );
          },
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => {
            return (
              <FontAwesome6
                name="clock"
                size={20}
                color={theme.buttonPrimary}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => {
            return <StartButton />;
          },
        }}
      />

      <Tabs.Screen
        name="exercises"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => {
            return (
              <FontAwesome6
                name="dumbbell"
                size={20}
                color={theme.buttonPrimary}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => {
            return (
              <FontAwesome6
                name="user-large"
                size={20}
                color={theme.buttonPrimary}
              />
            );
          },
        }}
      />
    </Tabs>
  );
}
