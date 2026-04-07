import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { act, useMemo, useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Theme } from "@/types/Theme";
import EvilIcons from "@expo/vector-icons/EvilIcons";

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
        style={[
          styles.container,
          { borderColor: active ? theme.inputFocusBorder : theme.inputBorder },
        ]}
        onPress={() => setActive((prev) => !prev)}
      >
        <View style={styles.nameIcon}>
          <Text>{selected || placeholder}</Text>
          {!active ? (
            <EvilIcons name="chevron-right" size={20} color={theme.text} />
          ) : (
            <EvilIcons name="chevron-down" size={20} color={theme.text} />
          )}
        </View>
      </Pressable>

      {active && (
        <View style={[styles.dropdown]}>
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
      marginBottom: 15 * scale,
    },
    container: {
      borderRadius: 10 * scale,
      borderWidth: 1 * scale,
      borderColor: theme.border,
      padding: 10 * scale,
      backgroundColor: theme.buttonSecondary,
    },
    dropdown: {
      borderWidth: 1 * scale,
      borderColor: theme.inputBorder,
      borderRadius: 10 * scale,
      marginTop: 4 * scale,
      overflow: "hidden",
      backgroundColor: theme.card,
      position: "absolute",
      top: 40,
      left: 0,
      right: 0,
      zIndex: 1000,
    },
    item: {
      padding: 10 * scale,
      borderBottomWidth: 1 * scale,
      borderBottomColor: theme.inputBorder,
    },
    nameIcon: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });
