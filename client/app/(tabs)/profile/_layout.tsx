import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, Stack } from "expo-router";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function _layout() {
  const { theme } = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
          headerRight: () => {
            return (
              <MaterialCommunityIcons
                name="cog"
                size={20}
                color={"black"}
                onPress={() => router.navigate("/(tabs)/profile/settings")}
              />
            );
          },
        }}
      />
      <Stack.Screen name="settings" />
      <Stack.Screen name="editProfile" />
      <Stack.Screen name="changePassword" />
      <Stack.Screen name="editDetails" />
    </Stack>
  );
}
