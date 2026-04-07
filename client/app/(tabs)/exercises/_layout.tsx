import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Exercises",
          headerRight: () => {
            return (
              <MaterialCommunityIcons
                name="plus"
                size={20}
                color={"black"}
                onPress={() =>
                  router.navigate("/(tabs)/exercises/createExercise")
                }
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="createExercise"
        options={{
          title: "Create Exercise",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
