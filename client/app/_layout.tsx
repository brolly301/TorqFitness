import { Redirect, Stack, usePathname } from "expo-router";
import "react-native-reanimated";
import Providers from "./providers";
import { useUserContext } from "@/context/UserContext";

function RootStack() {
  const { authToken } = useUserContext();

  return (
    <Stack>
      <Stack.Protected guard={!authToken.valid}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack.Protected>
      <Stack.Protected guard={authToken.valid}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack.Protected>
    </Stack>
  );
}

export default function AppLayout() {
  return (
    <Providers>
      <RootStack />
    </Providers>
  );
}
