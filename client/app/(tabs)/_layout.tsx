import { Redirect, Tabs, usePathname } from "expo-router";
import React, { useEffect } from "react";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { paddingTop: 10 },
      }}
    >
      <Tabs.Screen
        name="routines"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => {
            return <FontAwesome6 name="list" size={20} />;
          },
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => {
            return <FontAwesome6 name="dumbbell" size={20} />;
          },
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => {
            return <FontAwesome6 name="plus" size={20} />;
          },
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => {
            return <FontAwesome6 name="clock" size={20} />;
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => {
            return <FontAwesome6 name="user-large" size={20} />;
          },
        }}
      />
    </Tabs>
  );
}
