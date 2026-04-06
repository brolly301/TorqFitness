import { Redirect, Stack, usePathname } from "expo-router";
import "react-native-reanimated";
import Providers from "./providers";
import { useUserContext } from "@/context/UserContext";

function RootStack() {
  const pathname = usePathname();

  if (pathname === "/") {
    return <Redirect href="/profile" />;
  }

  const { user } = useUserContext();

  return (
    <Stack>
      {/* {user ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )} */}

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
