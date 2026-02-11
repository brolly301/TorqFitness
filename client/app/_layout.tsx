import { Redirect, Stack, usePathname } from "expo-router";
import "react-native-reanimated";

export default function RootLayout() {
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
