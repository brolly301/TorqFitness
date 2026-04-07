import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";

type Props = {
  data: string[];
  selected: string;
  setSelected: (value: string) => void;
  placeholder?: string;
};

export default function AppDropdown({
  data,
  selected,
  setSelected,
  placeholder = "Select an option",
}: Props) {
  const { theme, scale } = useAppTheme();
  const styles = useMemo(() => makeStyles(theme, scale), [theme, scale]);

  const [active, setActive] = useState<boolean>(false);

  const handleSelected = (item: string) => {
    setSelected(item);
    setActive(false);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.container}
        onPress={() => setActive((prev) => !prev)}
      >
        <Text>{selected || placeholder}</Text>
      </Pressable>

      {active && (
        <View style={styles.dropdown}>
          {data.map((item) => (
            <Pressable
              key={item}
              style={styles.item}
              onPress={() => handleSelected(item)}
            >
              <Text>{item}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export const makeStyles = (theme: Theme, scale: number) =>
  StyleSheet.create({
    wrapper: {
      gap: 6 * scale,
    },
    container: {
      borderRadius: 10 * scale,
      borderWidth: 1 * scale,
      borderColor: theme.border,
      padding: 10 * scale,
      backgroundColor: theme.background,
    },
    dropdown: {
      borderWidth: 1 * scale,
      borderColor: theme.border,
      borderRadius: 10 * scale,
      marginTop: 4 * scale,
      overflow: "hidden",
      backgroundColor: theme.background,
    },
    item: {
      padding: 10 * scale,
      borderBottomWidth: 1 * scale,
      borderBottomColor: theme.border,
    },
  });
