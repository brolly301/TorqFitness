import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, Stack } from "expo-router";
import { Text } from "react-native";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="exercise"
        options={{
          title: "Exercise",
        }}
      />
    </Stack>
  );
}
