import { Pressable, StyleSheet, TextInput, View } from "react-native";
import React, { useMemo, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type Props = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export default function AppSearchBar({ search, setSearch }: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const [active, setActive] = useState(false);

  const handleChange = (text: string) => {
    setSearch(text);
  };

  const handleClear = () => {
    setSearch("");
  };

  return (
    <View style={[styles.container, active && styles.containerActive]}>
      <Feather
        name="search"
        size={18 * scale}
        color={active ? theme.buttonPrimary : theme.textMuted}
      />

      <TextInput
        style={styles.input}
        value={search}
        onChangeText={handleChange}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        returnKeyType="search"
        placeholder="Search by name, muscle, or equipment"
        placeholderTextColor={theme.textMuted}
        accessibilityLabel="Search exercises"
      />

      {search.length > 0 && (
        <Pressable
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.clearButtonPressed,
          ]}
          onPress={handleClear}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Feather name="x" size={16 * scale} color={theme.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    container: {
      minHeight: 48 * scale,
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 14 * scale,
      paddingRight: 10 * scale,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 14 * scale,
    },

    containerActive: {
      backgroundColor: theme.buttonPrimary + "08",
      borderColor: theme.buttonPrimary + "60",
    },

    input: {
      flex: 1,
      marginLeft: 10 * scale,
      paddingVertical: 0,
      color: theme.text,
      fontSize: 14 * scale,
    },

    clearButton: {
      width: 32 * scale,
      height: 32 * scale,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.text + "08",
      borderRadius: 10 * scale,
    },

    clearButtonPressed: {
      opacity: 0.6,
    },
  });
