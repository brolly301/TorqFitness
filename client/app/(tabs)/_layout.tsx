import { Tabs } from "expo-router";
import React from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/useAppTheme";
import StartButton from "@/components/ui/StartButton";

export default function TabLayout() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      initialRouteName="workout"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.buttonPrimary,
        tabBarInactiveTintColor: theme.textMuted,

        tabBarStyle: {
          height: 58 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 6),
          backgroundColor: theme.card,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },

        tabBarItemStyle: {
          paddingTop: 1,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="routines"
        options={{
          title: "Routines",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="list" size={19} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="clock" size={19} color={color} />
          ),
        }}
      />

     <Tabs.Screen
  name="workout"
  options={{
    title: "Workout",
    tabBarIcon: ({ color }) => (
      <FontAwesome6 name="bolt" size={19} color={color} />
    ),
  }}
/>

      <Tabs.Screen
        name="exercises"
        options={{
          title: "Exercises",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="dumbbell" size={19} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="user-large" size={18} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}