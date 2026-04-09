import { StyleSheet } from "react-native";
import React, { ReactNode } from "react";
import { ExerciseProvider } from "@/context/ExerciseContext";
import { WorkoutProvider } from "@/context/WorkoutContext";
import { RoutineProvider } from "@/context/RoutineContext";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeProvider";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";

export default function Providers({ children }: { children: ReactNode }) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <UserProvider>
        <WorkoutProvider>
          <RoutineProvider>
            <ExerciseProvider>{children}</ExerciseProvider>
          </RoutineProvider>
        </WorkoutProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({});
