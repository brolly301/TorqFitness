import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Workout" }} />
      <Stack.Screen
        name="createWorkout"
        options={{
          title: "",
        }}
      />
    </Stack>
  );
}
