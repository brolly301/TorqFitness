import { StyleSheet, TextInput, View } from "react-native";
import React, { useMemo, useState } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type Props = {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function AppSearchBar({ setSearch }: Props) {
  const { theme, scale } = useAppTheme();
  const [active, setActive] = useState(false);
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  return (
    <View
      style={[
        styles.container,
        { borderColor: !active ? theme.inputBorder : theme.buttonPrimary },
      ]}
    >
      <FontAwesome6
        name="magnifying-glass"
        size={16 * scale}
        color={theme.buttonPrimary}
      />

      <TextInput
        style={[styles.input]}
        onFocus={() => setActive(true)}
        returnKeyType="search"
        onBlur={() => setActive(false)}
        placeholder="Search exercises..."
        placeholderTextColor={theme.textSecondary}
        onChangeText={setSearch}
      />
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",

      height: 46 * scale,
      borderRadius: 14 * scale,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      backgroundColor: theme.buttonSecondary,

      paddingHorizontal: 12 * scale,
    },

    input: {
      flex: 1,
      marginLeft: 10 * scale,
      fontSize: 15 * scale,
      color: theme.text,
      padding: 0,
    },
  });
