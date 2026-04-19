import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ title: "Welcome", headerShown: false }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="signUp"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="resetPassword"
        options={{
          title: "",
        }}
      />
    </Stack>
  );
}
