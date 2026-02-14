import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack>
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
    </Stack>
  );
}
