import { StyleSheet } from "react-native";
import React, { ReactNode } from "react";
import { ExerciseProvider } from "@/context/ExerciseContext";
import { WorkoutProvider } from "@/context/WorkoutContext";
import { RoutineProvider } from "@/context/RoutineContext";
import { UserProvider } from "@/context/UserContext";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { SettingsProvider } from "@/context/SettingsContext";
import ToastConfig from "@/components/ui/ToastConfig";

export default function Providers({ children }: { children: ReactNode }) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) return null;

  return (
    <UserProvider>
      <SettingsProvider>
        <WorkoutProvider>
          <RoutineProvider>
            <ExerciseProvider>
              {children}
              <ToastConfig />
            </ExerciseProvider>
          </RoutineProvider>
        </WorkoutProvider>
      </SettingsProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({});
