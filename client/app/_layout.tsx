import { Redirect, Stack, usePathname } from "expo-router";
import "react-native-reanimated";
import Providers from "./providers";

function RootStack() {
  const pathname = usePathname();

  if (pathname === "/") {
    return <Redirect href="/profile" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
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
