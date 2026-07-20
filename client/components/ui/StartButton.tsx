import { StyleSheet, View } from "react-native";
import React, { useMemo } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type Props = {
  focused: boolean;
};

export default function StartButton({ focused }: Props) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View
      style={[
        styles.container,
        focused ? styles.containerActive : styles.containerInactive,
      ]}
    >
     <FontAwesome6
  name="play"
  size={12}
  color={focused ? theme.buttonPrimary : theme.textMuted}
/>
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 16,
      borderWidth: 1,
      transform: [{ translateY: -5 }],
    },

    containerActive: {
      backgroundColor: theme.buttonPrimary + "18",
      borderColor: theme.buttonPrimary + "45",
    },

    containerInactive: {
      backgroundColor: theme.buttonSecondary,
      borderColor: theme.border,
    },
  });