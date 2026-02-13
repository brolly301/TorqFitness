import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "History",
          headerRight: () => {
            return (
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color={"black"}
              />
            );
          },
        }}
      />
    </Stack>
  );
}
