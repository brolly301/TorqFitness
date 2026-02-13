import { StyleSheet } from "react-native";
import React, { ReactNode } from "react";
import { ExerciseProvider } from "@/context/ExerciseContext";
import { WorkoutProvider } from "@/context/WorkoutContext";
import { RoutineProvider } from "@/context/RoutineContext";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeProvider";

export default function Providers({ children }: { children: ReactNode }) {
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
